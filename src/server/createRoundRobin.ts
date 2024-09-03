type Player = string;
type Match = [Player, Player];
type Round = Match[];
type Tournament = Round[];
import { MatchType } from "./db/schema";

export default function createRoundRobin(players: Player[], eventId: number): MatchType[]{
    const n: number = players.length;
    const rounds: Tournament = [];
    const playersCopy: (Player | "BYE")[] = [...players];
    let matchesToCreate: MatchType[] = [];

    if (n % 2 !== 0) {
        playersCopy.push("BYE");
    }

    for (let round = 0; round < playersCopy.length - 1; round++) {
        const roundPairings: Round = [];
        for (let i = 0; i < playersCopy.length / 2; i++) {
            if (playersCopy[i] !== "BYE" && playersCopy[playersCopy.length - 1 - i] !== "BYE") {
                roundPairings.push([playersCopy[i], playersCopy[playersCopy.length - 1 - i]] as Match);
            }
        }
        rounds.push(roundPairings);

        // Rotate players, keeping the first player fixed
        playersCopy.splice(1, 0, playersCopy.pop()!);
    }

    for(let i = 0; i < rounds.length; i++){
        // @ts-ignore
        for(let j = 0; j < rounds[i].length; j++){
            // @ts-ignore
            matchesToCreate.push({
                eventId,
                // @ts-ignore
                player1: rounds[i][j][0],
                // @ts-ignore
                player2: rounds[i][j][1],
                round: i+1,
                table: j+1,
            });
        }
    }

    return matchesToCreate;
    
}

// const matchesToCreate = createRoundRobin(["alan", "biden", "jimmy", "timmy", "jeff", "donald"], 1);

// for(let i = 0; i < matchesToCreate.length; i++){
//     console.log(matchesToCreate[i]);
// }
