import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events, groups, GroupType, matches, MatchType, players, PlayerType } from "~/server/db/schema";
import { eq, sql, desc, asc, inArray, and } from "drizzle-orm";

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

  checkIfFirstStageIsComplete: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .mutation(async ({ ctx, input }) => {

        const event = await ctx.db.query.events.findFirst({
          where: eq(events.id, input.eventId),
        });

        if(!event){
          throw new Error("Event not found");
        }

        if(!event.promptToCompleteFirstStage){
          throw new Error("Event is not ready or prompted to complete first stage");
        }

        // check if all matches are played by checking of either player's score is greater than 0
        const matchesForEvent = await ctx.db.query.matches.findMany({
          where: and(
              eq(matches.eventId, input.eventId),
              and(
                  eq(matches.player1Score, 0),
                  eq(matches.player2Score, 0)
              )
          )

        })

        // if all matches are played, set the event's isFirstStageComplete to true
        if(matchesForEvent.length === 0){
            await ctx.db.update(events).set({
                isFirstStageComplete: true
            }).where(eq(events.id, input.eventId));
        }

        // GENERATE FINAL STAGE MATCHES
        let topCutPlayers: PlayerType[] = []

        if(!event.numOfGroups){
          throw new Error("Event does not have any groups");
        }

        if(!event.howManyFromEachGroupAdvance){
          throw new Error("Event does not have any players to advance");
        }
        
        const numOfPlayersToAdvance: number = event.howManyFromEachGroupAdvance

        const groupsFromEvent: GroupType[] = await ctx.db.query.groups.findMany({
          where: eq(groups.eventId, input.eventId),
        })

        if(!groupsFromEvent){
          throw new Error("Event does not have any groups");
        }
        
        const topPlayersPromises = groupsFromEvent.map(group => 
          ctx.db.query.players.findMany({
            where: eq(players.groupId, group.id),
            orderBy: [desc(players.numberOfWins), desc(players.totalScore)],
            limit: numOfPlayersToAdvance
          })
        );

        const topPlayersGroups = await Promise.all(topPlayersPromises);
        topCutPlayers = topPlayersGroups.flat();

        //console.log("topCutPlayers", topCutPlayers);

        //create the matches using our topCutPlayers

        // check that the number of players is a power of 2
        if(!Number.isInteger(Math.log2(topCutPlayers.length))){
          throw new Error("Number of players is not a power of 2");
        }

        topCutPlayers.sort((a, b) => (a.numberOfWins || 0) - (b.numberOfWins || 0)).sort((a, b) => (a.totalScore || 0) - (b.totalScore || 0));

        const topCutRounds = Math.log2(topCutPlayers.length)

        let matchesIdArray: (number | null)[] = []

        for(let i = 0; i < topCutRounds; i++){

          let matchesToCreate: {
              eventId: number;
              player1: number | null;
              player2: number | null;
              player1Score: number;
              player2Score: number;
              finalStageMatch: boolean;
              nextTopCutMatchId: number | null;
              topCutPlayerSlotToMoveTo: number;
              round: number;
              table: number;
          }[] = []


          for(let j = 0; j < (2 ** i); j++){

            let nextTopCutMatchId: number | null = null

            if(i !== 0){
              const tempMatchId = matchesIdArray[Math.floor((matchesIdArray.length + j - 1)/2)]
              if(tempMatchId){
                nextTopCutMatchId = tempMatchId
              }
            }

            let player1: number | null = null
            let player2: number | null = null

            if(i === topCutRounds-1){
              const tempPlayer1 = topCutPlayers[j]
              const tempPlayer2 = topCutPlayers[topCutPlayers.length - 1 - j]
            
              if(tempPlayer1 && tempPlayer2){
                player1 = tempPlayer1.id
                player2 = tempPlayer2.id
              }
            }

            matchesToCreate.push({
              eventId: input.eventId,
              player1: player1,
              player2: player2,
              player1Score: 0,
              player2Score: 0,
              finalStageMatch: true,
              nextTopCutMatchId: nextTopCutMatchId,
              topCutPlayerSlotToMoveTo: (j % 2) + 1,
              round: topCutRounds - i,
              table: j + 1, 
            })
          }

          await ctx.db.update(events).set({
            numOfTopCutRounds: topCutRounds
          }).where(eq(events.id, input.eventId));

          const createdMatches: MatchType[] = await ctx.db.insert(matches).values(matchesToCreate).returning();

          matchesIdArray = matchesIdArray.concat(createdMatches.map(match => match.id))

        }



      // for(let i = 0; i < topCutPlayers.length/2; i++){
        
      //   const player1 = topCutPlayers[i];
      //   const player2 = topCutPlayers[topCutPlayers.length - 1 - i];
        
      //   if(!player1 || !player2){
      //     throw new Error("Player not found");
      //   }
      //   const match = {
      //     eventId: input.eventId,
      //     player1: player1.id,
      //     player2: player2.id,
      //     player1Score: 0,
      //     player2Score: 0,
      //     finalStageMatch: true,
      //     round: 1,
      //     table: i + 1,
      //   }

      //   matchesToCreate.push(match);

      // }
      
      //await ctx.db.insert(matches).values(matchesToCreate).returning();

      return {
        isFirstStageComplete: event.isFirstStageComplete
      }
    }),

  checkIfFinalStageIsComplete: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.query.events.findFirst({
        where: eq(events.id, input.eventId),
      });

      if(!event){
        throw new Error("Event not found");
      }

      if(!event.promptToCompleteFinalStage){
        throw new Error("First stage is not set to be completed");
      }

      const [newEvent] = await ctx.db.update(events).set({
        isFinalStageComplete: true
      }).where(eq(events.id, input.eventId)).returning();

    }),
});