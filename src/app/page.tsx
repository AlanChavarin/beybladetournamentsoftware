import { api, HydrateClient } from "~/trpc/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import EventsContainer from "./_homePageComponents/EventsContainer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

export default async function Home() {
  const { userId } = auth()
  const user = userId ? await currentUser() : null

  return (
    <HydrateClient>
      <div className="p-[12px] flex flex-col gap-[16px] items-center">
        <>
          {user?.publicMetadata?.admin &&
            <Link href="/admin" className="bg-green text-white py-[8px] px-[24px] rounded-[4px] box-shadow-small2 font-rubik text-[12px] flex items-center gap-[8px]">
              <div className="self-end">
                Admin Dashboard
              </div>
              <FontAwesomeIcon icon={faAnglesRight} className="size-[20px]"/>
            </Link>
          }
        </>
        <EventsContainer mode="checkin"/>
        <EventsContainer mode="pastTournaments"/>
      </div>
    </HydrateClient>
  )
}

// example comment
