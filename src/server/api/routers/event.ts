import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events, groups, eventPlayers, groupPlayers, matches } from "~/server/db/schema";
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
  
  // addPlayer: publicProcedure
  //   .input(z.object({ id: z.number(), player: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     // throw an error if the event doesnt exist
  //     const event = await ctx.db.query.events.findFirst({
  //       where: eq(events.id, input.id)
  //     })
  //     if (!event) {
  //       throw new Error("Event not found");
  //     }
  //     if (event?.players.includes(input.player)) {
  //       throw new Error("Player already in event");
  //     }
  //     return ctx.db.update(events)
  //       .set({ 
  //         players: sql`array_append(${events.players}, ${input.player})`
  //       })
  //       .where(eq(events.id, input.id))
  //       .returning();
  //   }),

  // removePlayer: publicProcedure
  //   .input(z.object({ id: z.number(), player: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     // Remove player from event logic
  //     return ctx.db.update(events)
  //       .set({ 
  //         players: sql`array_remove(${events.players}, ${input.player})`
  //       })
  //       .where(eq(events.id, input.id))
  //       .returning();
  //   }),

  // updateNumOfGroups: publicProcedure
  //   .input(z.object({ id: z.number(), numOfGroups: z.number() }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.update(events)
  //       .set({ 
  //         numOfGroups: input.numOfGroups
  //       })
  //       .where(eq(events.id, input.id))
  //       .returning();
  //   }),

  updateGroupSettings: publicProcedure
    .input(z.object({ id: z.number(), numOfGroups: z.number(), howManyFromEachGroupAdvance: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const updatedEvent = await ctx.db.update(events)
        .set({
          numOfGroups: input.numOfGroups,
          howManyFromEachGroupAdvance: input.howManyFromEachGroupAdvance
        })
        .where(eq(events.id, input.id))
        .returning();

      if (updatedEvent.length === 0) {
        throw new Error("Event not found");
      }
      
      //delete matches for this event
      await ctx.db.delete(matches).where(eq(matches.eventId, input.id));

      // Delete existing group assignments
      await ctx.db.delete(groupPlayers)
        .where(eq(groupPlayers.eventId, input.id));

      // Delete existing groups for this event
      await ctx.db.delete(groups)
        .where(eq(groups.eventId, input.id));

      // Create new groups based on the updated numOfGroups
      const newGroups = [];
      for (let i = 0; i < input.numOfGroups; i++) {
        const groupLetter = String.fromCharCode(97 + i); // 97 is the ASCII code for 'a'
        newGroups.push({
          eventId: input.id,
          groupLetter: groupLetter,
        });
      }

      // Insert new groups
      // change this so that the gruops are saved to a variable
      let savedGroups = await ctx.db.insert(groups).values(newGroups).returning();

      // Fetch all players for this event
      const players = await ctx.db.query.eventPlayers.findMany({
        where: eq(eventPlayers.eventId, input.id),
      });

      // Shuffle the players array
      const shuffledPlayers = players.sort(() => Math.random() - 0.5);

      // Assign players to groups evenly
      //const playersPerGroup = Math.ceil(shuffledPlayers.length / input.numOfGroups);

      const groupAssignments: { 
        eventId: number;
        playerId: number;
        groupId: number;
        groupLetter: string;
      }[] = [];

      let groupIndex = 0;
      for (let i = 0; i < shuffledPlayers.length; i++) {
        const player = shuffledPlayers[i];
        let group = savedGroups[groupIndex];
        if (player && player.playerId !== undefined && group && group.groupLetter !== null && group.numOfPlayers !== null) {
          groupAssignments.push({
            eventId: input.id,
            playerId: player.playerId,
            groupLetter: group.groupLetter,
            groupId: group.id,
          });

          group.numOfPlayers += 1;

        }
        if(groupIndex >= input.numOfGroups - 1){
          groupIndex = 0;
        } else {
          groupIndex++;
        }
      }

      // Insert new group assignments
      if (groupAssignments.length > 0) {
        await ctx.db.insert(groupPlayers).values(groupAssignments);
      }

      // Update the numOfPlayers for each group
      for (const group of savedGroups) {
        await ctx.db.update(groups)
          .set({ numOfPlayers: group.numOfPlayers })
          .where(eq(groups.id, group.id));
      }

    }),
});