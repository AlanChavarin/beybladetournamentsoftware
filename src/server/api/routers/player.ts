import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { eventPlayers, events, groupPlayers, groups, GroupWithPlayersType, players } from "~/server/db/schema";
import { eq, sql, desc, asc } from "drizzle-orm";

export const playerRouter = createTRPCRouter({
    getPlayersByEventId: publicProcedure
        .input(z.object({ eventId: z.number() }))
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.query.eventPlayers.findMany({
                where: eq(eventPlayers.eventId, input.eventId),
                with: {
                    player: true,
                },
            });

            
            // Map the results to return only the player data
            return data.map(ep => ep.player);
        }),
    
    addPlayerToEvent: publicProcedure
        .input(z.object({ eventId: z.number(), playerId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.insert(eventPlayers).values(input).returning();
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
                newPlayerArray = await ctx.db.insert(players).values({ name: input.playerName }).returning();
                if (!newPlayerArray) {
                    throw new Error("Failed to create new player");
                }

                newPlayer = newPlayerArray[0]

                if (!newPlayer) {
                    throw new Error("Failed to create new player");
                }

                await ctx.db.insert(eventPlayers).values({ eventId: input.eventId, playerId: newPlayer.id }).returning();
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

            console.log("groupWithLeastPlayers: ", groupWithLeastPlayers?.groupLetter)

            if (!newPlayer) {
                throw new Error("Failed to create new player");
            }

            // add the player to the group with the least amount of players
            if(groupWithLeastPlayers && groupWithLeastPlayers.numOfPlayers){
                await ctx.db.insert(groupPlayers).values({ 
                    groupId: groupWithLeastPlayers.id,
                    playerId: newPlayer.id,
                    eventId: input.eventId,
                }).returning();
                await ctx.db.update(groups).set({ numOfPlayers: groupWithLeastPlayers.numOfPlayers + 1 }).where(eq(groups.id, groupWithLeastPlayers.id));
            }

            //return ctx.db.insert(eventPlayers).values({ eventId: input.eventId, playerId: player.id }).returning();
        }),

    removePlayerFromEventViaUsername: publicProcedure
        .input(z.object({ eventId: z.number(), playerName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const player = await ctx.db.query.players.findFirst({
                where: eq(players.name, input.playerName),
            })

            if (!player) {
                throw new Error("Player not found");
            }

            const eventPlayer = await ctx.db.query.eventPlayers.findFirst({
                where: eq(eventPlayers.playerId, player.id),
            })

            if (!eventPlayer) {
                throw new Error("Player not found in event");
            }

            const groupPlayer = await ctx.db.query.groupPlayers.findFirst({
                where: eq(groupPlayers.playerId, player.id),
            })

            if (!eventPlayer || !groupPlayer) {
                throw new Error("Player not found in event or group");
            }

            // get the the corresponding group
            const group = await ctx.db.query.groups.findFirst({
                where: eq(groups.id, groupPlayer.groupId),
            })

            if (!group) {
                throw new Error("Group not found");
            }

            await ctx.db.delete(eventPlayers).where(eq(eventPlayers.id, eventPlayer.id));

            await ctx.db.update(groups).set({ numOfPlayers: group.numOfPlayers ? group.numOfPlayers - 1 : 0 }).where(eq(groups.id, groupPlayer.groupId));

            await ctx.db.delete(groupPlayers).where(eq(groupPlayers.id, groupPlayer.id));
            
        }),
        
});
