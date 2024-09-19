import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events, groups, eventPlayers, groupPlayers, players, GroupWithPlayersType } from "~/server/db/schema";
import { eq, sql, desc, asc } from "drizzle-orm";


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
});
