import { createTRPCRouter } from "../init";

import { messageRouter } from "@/modules/messages/server/procedure";
import { projectsRouter } from "@/modules/projects/server/procedure";
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
