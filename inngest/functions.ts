import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter";
import {getSandbox} from "@/inngest/utils";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event , step}) => {
        const sandboxId = await step.run("get-sandbox-id", async  () => {
            const sandbox = await Sandbox.create("clarna-nextjs-test2");
            return sandbox.sandboxId;
        });
        const summarizer = createAgent({
            name: "coding-agent",
            system: "you are an expert coder, you write next js & react code and build components",
            model: openai({ model: "gpt-4o"}),

        })
        const {output} = await summarizer.run(
          `summarize this: ${event.data.value}`
        );

        const sandboxUrl = await  step.run("get-sandbox-url", async () => {
            const sandbox = await getSandbox(sandboxId);
            const host =  sandbox.getHost(3000);
            return `http://${host}`;
        })

        return {output , sandboxUrl};
    },
);