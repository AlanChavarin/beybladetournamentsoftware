import { MatchType, PlayerType } from "./db/schema";
type Match = [PlayerType, PlayerType];
type Round = Match[];
type Tournament = Round[];

export default function createRoundRobin(players: PlayerType[], eventId: number, groupId: number): MatchType[]{
    const n: number = players.length;
    const rounds: Tournament = [];
    const playersCopy: (PlayerType | null)[] = [...players];
    let matchesToCreate: MatchType[] = [];

    if (n % 2 !== 0) {
        playersCopy.push(null);
    }

    for (let round = 0; round < playersCopy.length - 1; round++) {
        const roundPairings: Round = [];
        for (let i = 0; i < playersCopy.length / 2; i++) {
            if (playersCopy[i] !== null && playersCopy[playersCopy.length - 1 - i] !== null) {
                roundPairings.push([playersCopy[i], playersCopy[playersCopy.length - 1 - i]] as Match);
            }
        }
        rounds.push(roundPairings);

        // Rotate players, keeping the first player fixed
        playersCopy.splice(1, 0, playersCopy.pop()!);
    }

    //console.log("rounds: ", rounds[0][0][0].playerId);
    //onsole.log("rounds: ", rounds[0][0]);


    for (let i = 0; i < rounds.length; i++) {
        const round = rounds[i];
        if(round){
        for (let j = 0; j < round.length; j++) {
            const innerRound: Match | undefined = round[j];
            if (innerRound && innerRound[0] && innerRound[1]) {
                matchesToCreate.push({
                    eventId,
                    player1: innerRound[0].id,
                    player2: innerRound[1].id,
                    round: i + 1,
                    table: j + 1,
                    groupId,
                } as MatchType);
                }
            }
        }
    }

    //console.log("matchesToCreate: ", matchesToCreate);

    return matchesToCreate;
    
}

// const matchesToCreate = createRoundRobin(["alan", "biden", "jimmy", "timmy", "jeff", "donald"], 1);

// for(let i = 0; i < matchesToCreate.length; i++){
//     console.log(matchesToCreate[i]);
// }
