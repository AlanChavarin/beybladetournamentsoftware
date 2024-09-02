import { EventType } from "~/server/db/schema"
import EventThumbnailComponent from "../_components/EventThumbnailComponent"
import { api } from "~/trpc/server"


async function EventsContainer({mode, adminMode}: {mode: ('checkin' | 'pastTournaments'), adminMode?: boolean}) {

    const events: EventType[] = await api.event.getAll()

  return (
    <div className="bg-darkGray box-shadow w-full max-w-[400px]">
        <div className="flex flex-row h-[48px]">
            <div className="w-[64px] flex flex-row justify-center">
                <div className="relative w-[41px] h-[41px] self-end">
                    {mode === 'checkin' && 
                        <img src="/svgs/exclamation.svg" className="w-full h-full absolute z-[1]"/>
                    }

                    {mode === 'pastTournaments' && 
                        <img src="/svgs/swordWhite.svg" className="w-full h-full absolute z-[1] p-[3px]"/>
                    }
                    <img src="/svgs/RedThingy.svg" alt="" className="w-full h-full absolute z-[0]"/>
                </div>
            </div>

            <div className="text-white font-rubik text-[16px] pt-[4px] place-self-start self-center">
                {adminMode ? <>
                    {mode === 'checkin' && <div className="text-[12px]">Manage Upcoming Events</div>}
                    {mode === 'pastTournaments' && <div className="text-[12px]">Manage Past Tournaments</div>}
                </> : <>
                    {mode === 'checkin' && <>Check in Soon</>}
                    {mode === 'pastTournaments' && <>Past Tournaments</>}
                </>}
            </div>
        </div>

        <div className="h-full w-full bg-white flex flex-col">
            { events.map(event => <EventThumbnailComponent eventData={event} checkin={mode === 'checkin'} adminMode={adminMode}/>)}

        </div>
    </div>
  
)}
export default EventsContainer