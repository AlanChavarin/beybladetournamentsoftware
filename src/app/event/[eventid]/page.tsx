'use client'
import { useState, useEffect } from 'react'
import EventThumbnailComponent from "~/app/_components/EventThumbnailComponent"
import { EventType, GroupWithPlayersType, PlayerType } from "~/server/db/schema"
import { api } from "~/trpc/react"
import { useRouter, useSearchParams } from 'next/navigation'
import TabButton from '~/app/_components/TabButton'
import YourPairings from './_components/YourPairings'
import StandingsTab from '~/app/admin/event/[eventid]/_components/StandingsTab'

function Page({ params }: { params: { eventid: string } }) {
    const { eventid } = params
    const [event, setEvent] = useState<EventType | undefined>(undefined)
    const [players, setPlayers] = useState<PlayerType[] | undefined>(undefined)
    const [groupsWithPlayers, setGroupsWithPlayers] = useState<GroupWithPlayersType[] | undefined>(undefined)
    const router = useRouter()
    const searchParams = useSearchParams()

    const activeTab = searchParams.get('tab') || 'Your Pairings'

    const setTab = (tab: string) => {
      router.push(`/event/${eventid}?tab=${tab}`)
    }

    const renderTabContent = () => {
      if (!players) return <></>
      switch (activeTab) {
          case 'Your Pairings':
              return <YourPairings />
          case 'Standings':
              return event ? <StandingsTab event={event} groupsWithPlayers={groupsWithPlayers || []}/> : <></>
          case 'Deck List':
              return <>Deck List</>
          default:
              return <>None</>
      }
    }

    const { data: fetchedEvent, isLoading } = api.event.getById.useQuery({ id: parseInt(eventid) })
    const { data: fetchedPlayers, isLoading: isLoadingPlayers } = api.player.getPlayersByEventId.useQuery({ eventId: parseInt(eventid) })
    const { data: fetchedGroupsWithPlayers, isLoading: isLoadingGroupsWithPlayers } = api.group.getGroupsWithPlayersByEventId.useQuery({ eventId: parseInt(eventid)})

    useEffect(() => {
        if (fetchedEvent) {
          setEvent(fetchedEvent)
          setPlayers(fetchedPlayers)
          setGroupsWithPlayers(fetchedGroupsWithPlayers)
        }
    }, [fetchedEvent, fetchedPlayers])

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