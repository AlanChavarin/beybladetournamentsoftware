import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const eventRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      format: z.string().min(1),
      date: z.date(),
      location: z.string().min(1),
      time: z.date(),
      checkInTime: z.date(),
      deckListRequirement: z.enum(["top4", "topCut", "allPlayers"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create event logic
      return ctx.db.insert(events).values(input).returning();
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // Get event by ID logic
      return ctx.db.query.events.findFirst({
        where: eq(events.id, input.id),
      });
    }),

  getAll: publicProcedure
    .query(async ({ ctx }) => {
      // Get all events
      return ctx.db.query.events.findMany();
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      date: z.date().optional(),
      location: z.string().min(1).optional(),
      time: z.date().optional(),
      checkInTime: z.date().optional(),
      deckListRequirement: z.enum(["top4", "topCut", "allPlayers"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      // Update event logic
      return ctx.db.update(events)
        .set(updateData)
        .where(eq(events.id, id))
        .returning();
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Delete event logic
      return ctx.db.delete(events)
        .where(eq(events.id, input.id))
        .returning();
    }),
});