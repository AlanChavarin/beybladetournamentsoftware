import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events, groups, eventPlayers, groupPlayers, players, GroupWithPlayersType, matches, GroupWithMatchesWithPlayersType, formattedGroupWithMatchesWithPlayersType } from "~/server/db/schema";
import { eq, sql, desc, asc, aliasedTable } from "drizzle-orm";


export const groupRouter = createTRPCRouter({
  getGroupsByEventId: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.groups.findMany({
        where: eq(groups.eventId, input.eventId),
      });
    }),
    
  getGroupsWithPlayersByEventId: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
        const groupsWithPlayers = await ctx.db
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

        const result = groupsWithPlayers.reduce((acc, { group, player, groupPlayer }) => {
            const existingGroup = acc.find(g => g.id === group.id);
            if (existingGroup) {
              if (player) existingGroup.players.push({ ...player, ...groupPlayer });
            } else {
              acc.push({ ...group, players: player ? [{ ...player, ...groupPlayer }] : [] });
            }
            return acc;
          }, [] as Array<GroupWithPlayersType>);

        return result;
    }),

    getGroupsWithMatchesWithPlayersByEventId: publicProcedure
        .input(z.object({ eventId: z.number() }))
        .query(async ({ ctx, input }) => {
            const groupsWithMatchesWithPlayers: GroupWithMatchesWithPlayersType[] = await ctx.db.query.groups.findMany({
                where: eq(groups.eventId, input.eventId),
                with: {
                    matches: {
                        with: {
                            player1: true,
                            player2: true,
                        },
                    },
                },
            })

            // i want to reformat matches of the same round are put into their own array
            const reformattedGroupsWithMatchesWithPlayers: formattedGroupWithMatchesWithPlayersType[] = groupsWithMatchesWithPlayers.map(group => {
                if(!group.matches) return { ...group, matches: [] }
                const matches = group.matches.sort((a, b) => a.id - b.id)
                const rounds = [...new Set(matches.map(match => match.round))]
                const matchesByRound = rounds.map(round => matches.filter(match => match.round === round))
                return {
                    ...group,
                    matches: matchesByRound
                }
            })

        

        return reformattedGroupsWithMatchesWithPlayers
    }),
});
