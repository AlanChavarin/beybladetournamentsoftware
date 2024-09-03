import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events } from "~/server/db/schema";
import { eq, sql, desc, asc } from "drizzle-orm";

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
      return ctx.db.query.events.findMany({
        orderBy: desc(events.date),
      });
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
  
  addPlayer: publicProcedure
    .input(z.object({ id: z.number(), player: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // throw an error if the event doesnt exist
      const event = await ctx.db.query.events.findFirst({
        where: eq(events.id, input.id)
      })
      if (!event) {
        throw new Error("Event not found");
      }
      if (event?.players.includes(input.player)) {
        throw new Error("Player already in event");
      }
      return ctx.db.update(events)
        .set({ 
          players: sql`array_append(${events.players}, ${input.player})`
        })
        .where(eq(events.id, input.id))
        .returning();
    }),

  removePlayer: publicProcedure
    .input(z.object({ id: z.number(), player: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Remove player from event logic
      return ctx.db.update(events)
        .set({ 
          players: sql`array_remove(${events.players}, ${input.player})`
        })
        .where(eq(events.id, input.id))
        .returning();
    }),

  updateNumOfGroups: publicProcedure
    .input(z.object({ id: z.number(), numOfGroups: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update(events)
        .set({ 
          numOfGroups: input.numOfGroups
        })
        .where(eq(events.id, input.id))
        .returning();
    }),
});