import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { matches, events, MatchType, groups, players, GroupWithPlayersType } from "~/server/db/schema";
import { eq, sql, asc, and } from "drizzle-orm";
import createRoundRobin from "~/server/createRoundRobin";

export const matchRouter = createTRPCRouter({

    getMatchesByEventId: publicProcedure
    .input(z.object({
        eventId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
        return ctx.db.query.matches.findMany({
            where: eq(matches.eventId, input.eventId),
        });
    }),

    createMatchesBasedOnEvent: publicProcedure
        .input(z.object({eventId: z.number()}))
        .mutation(async ({ctx, input}) => {
            const groupsWithPlayersRawData = await ctx.db.query.groups.findMany({
                where: eq(groups.eventId, input.eventId),
                orderBy: asc(groups.groupLetter),
                with: {
                    players: true
                }
            })

            if(!groupsWithPlayersRawData){
                throw new Error("Failed to get groups with players");
            }

            const matchesToCreate: MatchType[][] = groupsWithPlayersRawData.map(group => {
                return createRoundRobin(group.players, input.eventId, group.id)
            })

            const flattedMatchesToCreate: MatchType[] = matchesToCreate.flatMap(match => match).filter(match => match !== undefined) as MatchType[];

            const result = await ctx.db.insert(matches).values(flattedMatchesToCreate).returning();

            return result;
        }),

    setMatchResult: publicProcedure
        .input(z.object({
            matchId: z.number(),
            eventId: z.number(),
            player1Id: z.number(),
            player2Id: z.number(),
            player1Score: z.number(),
            player2Score: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            const [newMatch] = await ctx.db.update(matches).set({ player1Score: input.player1Score, player2Score: input.player2Score }).where(eq(matches.id, input.matchId)).returning();

            const player1TotalScore: number = (await ctx.db.query.matches.findMany({
                where: and(
                    eq(matches.player1, input.player1Id),
                    eq(matches.eventId, input.eventId)
                )
            }))
            .map(match => match.player1Score)
            .reduce((acc: number, curr) => {
                if(curr !== null && acc !== null){
                    return acc + curr;
                }
                return acc;
            }, 0);

            const player1TotalWins = (await ctx.db.query.matches.findMany({
                where: and(
                    eq(matches.player1, input.player1Id),
                    eq(matches.eventId, input.eventId)
                )
            }))
            .reduce((acc, curr) => {
                const player1Score = curr?.player1Score;
                const player2Score = curr?.player2Score;
                if(player1Score === null || player2Score === null){
                    return acc;
                }
                if(player1Score > player2Score){
                    return acc + 1;
                }
                return acc;
            }, 0);

            const player2TotalScore: number = (await ctx.db.query.matches.findMany({
                where: and(
                    eq(matches.player2, input.player2Id),
                    eq(matches.eventId, input.eventId)
                )
            }))
            .map(match => match.player2Score)
            .reduce((acc: number, curr) => {
                if(curr !== null && acc !== null){
                    return acc + curr;
                }
                return acc
            }, 0);

            const player2TotalWins: number = (await ctx.db.query.matches.findMany({
                where: and(
                    eq(matches.player2, input.player2Id),
                    eq(matches.eventId, input.eventId)
                )
            }))
            .reduce((acc, curr) => {
                const player1Score = curr?.player1Score;
                const player2Score = curr?.player2Score;
                if(player2Score === null || player1Score === null){
                    return acc;
                }
                if(player2Score > player1Score){
                    return acc + 1;
                }
                return acc;
            }, 0);

            await ctx.db.update(players).set({
                totalScore: player1TotalScore,
                numberOfWins: player1TotalWins
            }).where(eq(players.id, input.player1Id));

            await ctx.db.update(players).set({
                totalScore: player2TotalScore,
                numberOfWins: player2TotalWins
            }).where(eq(players.id, input.player2Id));

            return {
                player1TotalScore,
                player1TotalWins,
                player2TotalScore,
                player2TotalWins
            }

        }),


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