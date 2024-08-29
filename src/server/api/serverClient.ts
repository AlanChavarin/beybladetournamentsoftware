import { createCallerFactory } from "./trpc";
import { appRouter } from "./root";
import { db } from "../db";

const createCaller = createCallerFactory(appRouter);

export const serverClient = createCaller({
    headers: new Headers(),
    db
})