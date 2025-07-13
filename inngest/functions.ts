import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event}) => {
        const summarizer = createAgent({
            name: "summarizer",
            system: "You are an expert Summarizer. you summarize in a sentence.",
            model: openai({ model: "gpt-4o"}),

        })
        const {output} = await summarizer.run(
          `summarize this: ${event.data.value}`
        );

        return {output};
    },
);