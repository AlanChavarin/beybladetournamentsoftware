import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { MatchWithPlayersType } from "~/server/db/schema"

const checkIfComplete = (match: MatchWithPlayersType) => {
    return match?.player1Score || match?.player2Score
}


const getColor = (match: MatchWithPlayersType, player: 'player1' | 'player2') => {

    if(!match || match.player1Score === null || match.player2Score === null){
        return 'bg-darkGray'
    }
    if (player === 'player1') {
        return match?.player1Score > match?.player2Score ? 'bg-specialRed' : 'bg-darkGray'
    } else {
        return match?.player2Score > match?.player1Score ? 'bg-specialRed' : 'bg-darkGray'
    }
}

function GroupCarouselItem({match, handleClick}: {match: MatchWithPlayersType, handleClick: (match: MatchWithPlayersType) => void}) {


    return (
        <button className='bg-darkGray w-full h-[32px] flex items-center justify-start box-shadow-small2' onClick={() => handleClick(match)}>
            <div className={`min-w-[36px] h-full ${checkIfComplete(match) ? 'bg-lightGray5' : 'bg-white'} text-black flex items-center justify-center font-rubik text-[14px]`}>
                {match?.table}
                {checkIfComplete(match) ? <FontAwesomeIcon icon={faCheck}/> : <></>}
            </div>
            <div className={`basis-[120px] h-full ${getColor(match, 'player1')} text-white flex items-center justify-center font-rubik text-[10px] flex-1 text-center`}>
                {match?.player1?.name}
            </div>
            <div className='basis-[32px] h-full bg-darkGray text-black flex items-center justify-center font-rubik text-[10px] relative'>
                {match?.player2Score || match?.player1Score ?
                    <div className='text-white text-nowrap text-[14px] z-[1] px-[8px]'>{match?.player1Score ?? 0}-{match?.player2Score ?? 0}</div>
                    :
                    <>
                        <div className='text-white absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[1]'>
                            VS
                        </div>
                    </>
                }
                <img src="/svgs/RedThingy.svg" alt="redThingy" className='size-full absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[0]' />
            </div>
            <div className={`basis-[120px] h-full ${getColor(match, 'player2')} text-white flex items-center justify-center font-rubik text-[10px] flex-1 text-center`}>

                {match?.player2?.name}
            </div>
        </button>
    )
}

export default GroupCarouselItem