import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useEmblaCarousel from "embla-carousel-react"
import { useState } from "react"
import { DotButton, useDotButton } from "~/app/_components/EmblaCarouselDotButton"
import { MatchType, MatchWithPlayersType } from "~/server/db/schema"
import MatchScoreForm from "./MatchScoreForm"
import GroupCarouselItem from "./GroupCarouselItem"


function TopCutStageCarousel({topCutMatchesWithPlayers}: {topCutMatchesWithPlayers: MatchWithPlayersType[][]}) {
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
        setOpenMatch(match)
    }


  return (
    <div className="flex flex-col w-full box-shadow-small2">
        <div className="bg-darkGray text-white font-rubik w-full py-[4px] px-[12px] text-[14px] relative">
            <div className="relative z-[1]">
                Final Stage
            </div>
            <div className="absolute left-[4px] top-[50%] translate-y-[-50%] z-0">
                <img src="/svgs/redThingy.svg" alt="redThingy" className="w-[24px] h-[24px]" />
            </div>
        </div>
        <div className='bg-lightGray3'>
            <div className="embla">
                <div className="embla__viewport text-white flex justify-center" ref={emblaRef}>
                    <div className="embla__container gap-[16px] max-w-[300px] py-[16px]">
                        {topCutMatchesWithPlayers.map((round, index) => (
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
export default TopCutStageCarousel