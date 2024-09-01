'use client'
import { useState, useEffect } from 'react'
import EventThumbnailComponent from "~/app/_components/EventThumbnailComponent"
import { EventType } from "~/server/db/schema"
import { api } from "~/trpc/react"
import { useRouter, useSearchParams } from 'next/navigation'
import StandingsTab from './_components/StandingsTab'
import SettingsTab from './_components/SettingsTab'
import TabButton from '~/app/_components/TabButton'
import GroupStage from './_components/GroupStage'
import FinalStage from './_components/FinalStage'

const Page = ({ params }: { params: { eventid: string } }) => {
  const { eventid } = params
  const [event, setEvent] = useState<EventType | undefined>(undefined)
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeTab = searchParams.get('tab') || 'Standings'

  const setTab = (tab: string) => {
    router.push(`/admin/event/${eventid}?tab=${tab}`)
  }

  const renderTabContent = () => {
    switch (activeTab) {
        case 'Standings':
            return <StandingsTab />
        case 'Settings':
            return <SettingsTab/>
        case 'Group Stage':
            return <GroupStage/>
        case 'Final Stage':
            return <FinalStage/>
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
                            <TabButton color='green' text="Standings" onClick={() => setTab('Standings')} activeTab={activeTab}/>
                            <TabButton color='green' text="Settings" onClick={() => setTab('Settings')} activeTab={activeTab}/>
                            <TabButton color='green' text="Group Stage" onClick={() => setTab('Group Stage')} activeTab={activeTab}/>
                            <TabButton color='green' text="Final Stage" onClick={() => setTab('Final Stage')} activeTab={activeTab}/>
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