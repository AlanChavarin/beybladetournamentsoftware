'use client'
import { useState, useEffect } from 'react'
import EventThumbnailComponent from "~/app/_components/EventThumbnailComponent"
import { EventType } from "~/server/db/schema"
import { api } from "~/trpc/react"
import { useRouter, useSearchParams } from 'next/navigation'
import TabButton from '~/app/_components/TabButton'
import YourPairings from './_components/YourPairings'
import StandingsTab from '~/app/admin/event/[eventid]/_components/StandingsTab'

function Page({ params }: { params: { eventid: string } }) {
    const { eventid } = params
    const [event, setEvent] = useState<EventType | undefined>(undefined)
    const router = useRouter()
    const searchParams = useSearchParams()

    const activeTab = searchParams.get('tab') || 'Your Pairings'

    const setTab = (tab: string) => {
      router.push(`/event/${eventid}?tab=${tab}`)
    }

    const renderTabContent = () => {
      switch (activeTab) {
          case 'Your Pairings':
              return <YourPairings />
          case 'Standings':
              return <StandingsTab dontShowCode={true}/>
          case 'Deck List':
              return <>Deck List</>
          default:
              return <>None</>
      }
    }

    const { data: fetchedEvent, isLoading } = api.event.getById.useQuery({ id: parseInt(eventid) })

    useEffect(() => {
        if (fetchedEvent) {
          setEvent(fetchedEvent)
        }
    }, [fetchedEvent])

  return (
    <div className="flex flex-col items-center gap-[8px]">
      <div className="flex flex-col gap-[12px] w-full max-w-[500px] pb-[32px]">
            {
                event ? 
                    <>
                        <EventThumbnailComponent eventData={event} />
                        <div className="flex flex-row justify-center gap-[8px] text-[10px]">
                            <TabButton color='green' text="Your Pairings" onClick={() => setTab('Your Pairings')} activeTab={activeTab}/>
                            <TabButton color='green' text="Standings" onClick={() => setTab('Standings')} activeTab={activeTab}/>
                            <TabButton color='green' text="Deck List" onClick={() => setTab('Deck List')} activeTab={activeTab}/>
                        </div>
                        {renderTabContent()}
                    </>    
                    : 
                    <div className="text-center  font-rubik text-[16px]">Event not found</div>
            }
            
            
        </div>
    </div>
  )
}
export default Page