'use client'
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { formattedGroupWithMatchesWithPlayersType, GroupType, GroupWithMatchesWithPlayersType, MatchWithPlayersType } from '~/server/db/schema'

function GroupCarouselItem({match}: {match: MatchWithPlayersType}) {
    return (
        <div className='bg-darkGray w-full h-[32px] flex items-center box-shadow-small2'>
            <div className='basis-[36px] h-full bg-white text-black flex items-center justify-center font-rubik text-[14px]'>
                {match?.table}
            </div>
            <div className='basis-[120px] h-full bg-darkGray text-white flex items-center justify-center font-rubik text-[10px] flex-1 text-center'>
                {match?.player2?.name}
            </div>
            <div className='basis-[32px] h-full bg-darkGray text-black flex items-center justify-center font-rubik text-[10px] relative'>
                <div className='text-white absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[1]'>
                    VS
                </div>
                <img src="/svgs/RedThingy.svg" alt="redThingy" className='size-full' />
            </div>
            <div className='basis-[120px] h-full bg-darkGray text-white flex items-center justify-center font-rubik text-[10px] flex-1 text-center'>
                {match?.player1?.name}
            </div>
        </div>
    )
}

// turn this into a functional component
function FirstStageGroupCarousel({formattedGroupWithMatchesWithPlayers}: {formattedGroupWithMatchesWithPlayers: formattedGroupWithMatchesWithPlayersType}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
    const [currentIndex, setCurrentIndex] = useState(0)

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const onSelect = useCallback(() => {
        if (emblaApi) {
            setCurrentIndex(emblaApi.selectedScrollSnap())
        }
    }, [emblaApi])

    useEffect(() => {
        if (emblaApi) {
            emblaApi.on('select', onSelect)
            onSelect() // Set initial index
        }
    }, [emblaApi, onSelect])


  return (
    <div className="flex flex-col w-full box-shadow-small2 ">
        <div className="bg-darkGray text-white font-rubik w-full py-[4px] px-[12px] text-[14px] relative">
            <div className="relative z-[1]">
                Group {formattedGroupWithMatchesWithPlayers.groupLetter} | Round {currentIndex + 1}
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
                                    <GroupCarouselItem key={matchIndex} match={match} />
                                ))}
                            </div>
                        ))}
                        {/* <div className="embla__slide flex flex-col gap-[8px]">
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                        </div>
                        <div className="embla__slide flex flex-col gap-[8px]">
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                        </div>
                        <div className="embla__slide flex flex-col gap-[8px]">
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                        </div>
                        <div className="embla__slide flex flex-col gap-[8px]">
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                            <GroupCarouselItem />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}
export default FirstStageGroupCarousel