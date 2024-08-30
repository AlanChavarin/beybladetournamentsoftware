import { api, HydrateClient } from "~/trpc/server"

import EventsContainer from "./_homePageComponents/EventsContainer"

export default async function Home() {
 

  return (
    <HydrateClient>
      <div className="p-[12px] flex flex-col gap-[16px] items-center">
        <EventsContainer mode="checkin"/>
        <EventsContainer mode="pastTournaments"/>
        {/* <button className="bg-green w-[80%] h-[42px] rounded-[8px] flex justify-center items-center text-white font-semibold text-[18px] box-shadow-small">
          Create New Event
        </button> */}
      </div>
    </HydrateClient>
  )
}

// example comment
