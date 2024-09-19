//import { postRouter } from "~/server/api/routers/post";
import { eventRouter } from "~/server/api/routers/event";
import { playerRouter } from "~/server/api/routers/player";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { groupRouter } from "./routers/group";
import { matchRouter } from "./routers/match";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  //post: postRouter,
  event: eventRouter,
  player: playerRouter,
  group: groupRouter,
  match: matchRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
