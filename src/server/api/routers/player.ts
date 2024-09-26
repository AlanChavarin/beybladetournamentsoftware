import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events, groups, players } from "~/server/db/schema";
import { eq, sql, desc, asc } from "drizzle-orm";

export const playerRouter = createTRPCRouter({
    getPlayersByEventId: publicProcedure
        .input(z.object({ eventId: z.number() }))
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.query.players.findMany({
                where: eq(players.eventId, input.eventId),
            });
            
            // Map the results to return only the player data
            return data;
        }),


    addPlayerToEventViaUsername: publicProcedure
        .input(z.object({ eventId: z.number(), playerName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const player = await ctx.db.query.players.findFirst({
                where: eq(players.name, input.playerName),
            })

            let newPlayerArray
            let newPlayer
            if (!player) {
                //create a new player if the player does not exist
                newPlayerArray = await ctx.db.insert(players).values({ name: input.playerName, eventId: input.eventId }).returning();
                if (!newPlayerArray) {
                    throw new Error("Failed to create new player");
                }

                newPlayer = newPlayerArray[0]

                if (!newPlayer) {
                    throw new Error("Failed to create new player");
                }
            }
            
            // get the group with the least amount of players for an event, using the num_of_players column to determine this
            const groupsWithPlayers = await ctx.db.query.groups.findMany({
                where: eq(groups.eventId, input.eventId),
                orderBy: asc(groups.numOfPlayers),
            });

            if (!groupsWithPlayers) {
                throw new Error("Failed to get groups with players");
            }

            // get the group with the least amount of players
            const groupWithLeastPlayers = groupsWithPlayers[0];

            //console.log("groupWithLeastPlayers: ", groupWithLeastPlayers?.groupLetter)

            if (!newPlayer) {
                throw new Error("Failed to create new player");
            }

            // add the player to the group with the least amount of players
            if(groupWithLeastPlayers && groupWithLeastPlayers.numOfPlayers){
                await ctx.db.update(players).set({ groupId: groupWithLeastPlayers.id }).where(eq(players.id, newPlayer.id));

                await ctx.db.update(groups).set({ numOfPlayers: groupWithLeastPlayers.numOfPlayers + 1 }).where(eq(groups.id, groupWithLeastPlayers.id));
            }

            //return ctx.db.insert(eventPlayers).values({ eventId: input.eventId, playerId: player.id }).returning();
        }),

    removePlayerFromEventViaUsername: publicProcedure
        .input(z.object({ eventId: z.number(), playerName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const player = await ctx.db.delete(players).where(eq(players.name, input.playerName)).returning()

            if (!player) {
                throw new Error("Player not found");
            }

            return player
        }),
        
});
