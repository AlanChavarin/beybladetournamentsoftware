import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { matches, events, MatchType, groups, players, groupPlayers, eventPlayers, GroupWithPlayersType } from "~/server/db/schema";
import { eq, sql, asc } from "drizzle-orm";
import createRoundRobin from "~/server/createRoundRobin";

export const matchRouter = createTRPCRouter({

    createMatchesBasedOnEvent: publicProcedure
    .input(z.object({
        eventId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
        const groupsWithPlayersRawData = await ctx.db
        .select({
          group: groups,
          player: players,
          groupPlayer: groupPlayers,
        })
        .from(groups)
        .leftJoin(groupPlayers, eq(groups.id, groupPlayers.groupId))
        .leftJoin(players, eq(groupPlayers.playerId, players.id))
        .where(eq(groups.eventId, input.eventId))
        .orderBy(asc(groups.groupLetter));

        const groupsWithPlayers = groupsWithPlayersRawData.reduce((acc, { group, player, groupPlayer }) => {
            const existingGroup = acc.find(g => g.id === group.id);
            if (existingGroup) {
              if (player) existingGroup.players.push({ ...player, ...groupPlayer });
            } else {
              acc.push({ ...group, players: player ? [{ ...player, ...groupPlayer }] : [] });
            }
            return acc;
          }, [] as Array<GroupWithPlayersType>);

          
        const matchesToCreate = groupsWithPlayers.map(group => {
            const players = group.players
            if(players){    
                const matchesToCreate = createRoundRobin(players, input.eventId, group.id);
                return matchesToCreate;
            }
        })

        const flattedMatchesToCreate: MatchType[] = matchesToCreate.flatMap(match => match).filter(match => match !== undefined) as MatchType[];

        const result = await ctx.db.insert(matches).values(flattedMatchesToCreate).returning();

        //console.log("result: ", flattedMatchesToCreate);

        return result;

    }),

    // createMatchesBasedOnEvent: publicProcedure
    // .input(z.object({
    //     eventId: z.number(),
    // }))
    // .mutation(async ({ ctx, input }) => {

    //     let matchesToCreate: MatchType[]

    //     const event = await ctx.db.query.events.findFirst({
    //         where: eq(events.id, input.eventId),
    //     })

    //     if (!event) {
    //         throw new Error("Event not found");
    //     }

    //     if(event.players){
    //         const playersArray = event.players.split(",");
    //         matchesToCreate = createRoundRobin(playersArray, event.id);

    //         return ctx.db.insert(matches).values(matchesToCreate).returning();
    //     } else {
    //         throw new Error("No players found");
    //     }
    // }),

    // create: publicProcedure
    // .input(z.object({
    //     eventId: z.number(),
    //     player1: z.string(),
    //     player2: z.string(),
    //     winner: z.string(),
    // }))
    // .mutation(async ({ ctx, input }) => {
    //     return ctx.db.insert(matches).values(input).returning();
    // }),

    // getById: publicProcedure
    // .input(z.object({
    //     id: z.number(),
    // }))
    // .query(async ({ ctx, input }) => {
    //     return ctx.db.query.matches.findFirst({
    //         where: eq(matches.id, input.id),
    //     });
    // }),

    // getAll: publicProcedure
    // .query(async ({ ctx }) => {
    //     return ctx.db.query.matches.findMany();
    // }),

    // update: publicProcedure
    // .input(z.object({
    //     id: z.number(),
    //     eventId: z.number().optional(),
    //     player1: z.string().optional(),
    //     player2: z.string().optional(),
    //     winner: z.string().optional(),
    // }))
    // .mutation(async ({ ctx, input }) => {
    //     const { id, ...updateData } = input;
    //     return ctx.db.update(matches)
    //     .set(updateData)
    //     .where(eq(matches.id, id))
    //     .returning();
    // }),

    // delete: publicProcedure
    // .input(z.object({
    //     id: z.number(),
    // }))
    // .mutation(async ({ ctx, input }) => {
    //     return ctx.db.delete(matches).where(eq(matches.id, input.id));
    // }),

    // getByEventId: publicProcedure
    // .input(z.object({
    //     eventId: z.number(),
    // }))
    // .query(async ({ ctx, input }) => {
    //     return ctx.db.query.matches.findMany({
    //         where: eq(matches.eventId, input.eventId),
    //         orderBy: [asc(matches.round), asc(matches.table)],
    //     });
    // }),


});