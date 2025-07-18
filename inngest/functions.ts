import { inngest } from "./client";
import {
  openai,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantMessage } from "@/inngest/utils";
import { z } from "zod";
import { PROMPT } from "@/lib/prompt";
import { prisma } from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("Clarna-nextjs-test2");
      return sandbox.sandboxId;
    });

    const codingAgent = createAgent<AgentState>({
      name: "coding-agent",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "use the terminal to run commands",
          parameters: z.object({
            command: z
              .string()
              .describe("The command to run in the sandbox terminal"),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout || result.stderr || "Command completed";
              } catch (e) {
                console.error(
                  `command failed: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}\n`,
                );
                return `command failed: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}\n`;
              }
            });
          },
        }),

        createTool({
          name: "create-update-files",
          description: "create or update files in the sandbox",
          parameters: z.object({
            files: z
              .array(
                z.object({
                  path: z.string().describe("The file path"),
                  content: z.string().describe("The file content"),
                }),
              )
              .describe("Array of files to create or update"),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>,
          ) => {
            const newfiles = await step?.run(
              "create-update-files",
              async () => {
                try {
                  const updatedfiles = network?.state?.data?.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedfiles[file.path] = file.content;
                  }
                  return updatedfiles;
                } catch (e) {
                  console.error("Error creating/updating files:", e);
                  return { error: `Error creating/updating files: ${e}` };
                }
              },
            );
            if (
              newfiles &&
              typeof newfiles === "object" &&
              !newfiles.error &&
              network
            ) {
              network.state.data.files = newfiles;
            }
            return newfiles;
          },
        }),

        createTool({
          name: "read-files",
          description: "read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()).describe("Array of file paths to read"),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("read-files", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  try {
                    const content = await sandbox.files.read(file);
                    contents.push({ path: file, content });
                  } catch (fileError) {
                    contents.push({
                      path: file,
                      error: `Could not read file: ${fileError}`,
                    });
                  }
                }
                return JSON.stringify(contents);
              } catch (e) {
                console.error("Error reading files:", e);
                return JSON.stringify({ error: `Error reading files: ${e}` });
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async function ({ result, network }) {
          const lastAssistantMessageText = lastAssistantMessage(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codingAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codingAgent;
      },
    });

    const result = await network.run(event.data.value);

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        await prisma.message.create({
          data: {
            content: "Something went wrong, please try again.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          Fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: "fragment",
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);
