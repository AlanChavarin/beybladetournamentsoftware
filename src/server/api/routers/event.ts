import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events, groups, matches, players } from "~/server/db/schema";
import { eq, sql, desc, asc, inArray } from "drizzle-orm";

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

      //clear the groupId and reset the wins and score for all players for this event
      await ctx.db.update(players)
        .set({
          groupId: null,
          numberOfWins: 0,
          totalScore: 0,
        })
        .where(eq(players.eventId, input.id));
      
      //delete matches for this event
      await ctx.db.delete(matches)
        .where(eq(matches.eventId, input.id));

      // Delete existing groups for this event
      await ctx.db.delete(groups)
        .where(eq(groups.eventId, input.id));

      await ctx.db.update(events).set({
        isFirstStageComplete: false
      }).where(eq(events.id, input.id));

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
      const playerData = await ctx.db.query.players.findMany({
        where: eq(players.eventId, input.id),
      });

      // Shuffle the players array
      const shuffledPlayers = playerData.sort(() => Math.random() - 0.5);


      const groupAssignments: {
        groupId: number;
        playerIds: number[];
      }[] = [];

      for (let i = 0; i < input.numOfGroups; i++) {
        const group = savedGroups[i];
        if (group) {
          groupAssignments.push({
            groupId: group.id,
            playerIds: [],
          });
        }
      }

      for(let i = 0; i < shuffledPlayers.length; i++){
        const player = shuffledPlayers[i];
        const groupAssignment = groupAssignments[i % input.numOfGroups];
        if (groupAssignment && player) {
          groupAssignment.playerIds.push(player.id);
        }
      }

      if (groupAssignments.length > 0) {
        await Promise.all(groupAssignments.map(async (groupAssignment) => {
          return ctx.db.update(players)
            .set({
              groupId: groupAssignment.groupId,
            })
            .where(inArray(players.id, groupAssignment.playerIds))
            .returning();
        }));
      }

      // Update the numOfPlayers for each group
      groupAssignments.forEach(async (groupAssignment) => {
        await ctx.db.update(groups)
          .set({ numOfPlayers: groupAssignment.playerIds.length })
          .where(eq(groups.id, groupAssignment.groupId));
      });

      return updatedEvent;
    }),
});