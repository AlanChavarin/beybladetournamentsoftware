'use client'
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { EventType, formattedGroupWithMatchesWithPlayersType, GroupType, GroupWithMatchesWithPlayersType, MatchWithPlayersType } from '~/server/db/schema'
import MatchScoreForm from './MatchScoreForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { DotButton, useDotButton } from '~/app/_components/EmblaCarouselDotButton'

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

const checkIfComplete = (match: MatchWithPlayersType) => {
    return match?.player1Score || match?.player2Score
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

// turn this into a functional component
function FirstStageGroupCarousel({event, formattedGroupWithMatchesWithPlayers}: {event: EventType, formattedGroupWithMatchesWithPlayers: formattedGroupWithMatchesWithPlayersType}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: false,
        startIndex: 0
    })

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

    const prevOnClick = () => {
        emblaApi?.scrollPrev()
    }

    const nextOnClick = () => {
        emblaApi?.scrollNext()
    }
    
    const [openMatch, setOpenMatch] = useState<MatchWithPlayersType | undefined>(undefined)

    const handleClick = (match: MatchWithPlayersType) => { 
        if(!event.isFirstStageComplete){
            setOpenMatch(match)
        }
    }


  return (
    <div className="flex flex-col w-full box-shadow-small2">
        <div className="bg-darkGray text-white font-rubik w-full py-[4px] px-[12px] text-[14px] relative">
            <div className="relative z-[1]">
                Group {formattedGroupWithMatchesWithPlayers.groupLetter} | Round {selectedIndex + 1}
            </div>
            <div className="absolute left-[4px] top-[50%] translate-y-[-50%] z-0">
                <img src="/svgs/redThingy.svg" alt="redThingy" className="w-[24px] h-[24px]" />
            </div>
        </div>
        <div className='bg-lightGray3'>
            <div className="embla">
                <div className="embla__viewport text-white flex justify-center" ref={emblaRef}>
                    <div className="embla__container gap-[16px] max-w-[300px] py-[16px]">
                        {formattedGroupWithMatchesWithPlayers.matches && formattedGroupWithMatchesWithPlayers.matches.map((round, index) => (
                            <div className="embla__slide flex flex-col gap-[8px]" key={index}>
                                {round.map((match, matchIndex) => (
                                    <GroupCarouselItem handleClick={handleClick} key={matchIndex} match={match} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='flex justify-center items-center flex-wrap pb-[16px]'>
                <button className='size-[24px] flex items-center justify-center' onClick={prevOnClick}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                { scrollSnaps.map((_, index) => (
                    <DotButton 
                        key={index}
                        active={index === selectedIndex}
                        onClick={() => onDotButtonClick(index)} 
                    />
                ))}
                <button className='size-[24px] flex items-center justify-center' onClick={nextOnClick}>

                    <FontAwesomeIcon icon={faChevronRight} />
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
        {openMatch && <MatchScoreForm openMatch={openMatch} setOpenMatch={setOpenMatch} />}

    </div>
  )
}
export default FirstStageGroupCarousel