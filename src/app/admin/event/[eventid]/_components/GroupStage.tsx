'use client'
import { EventType, formattedGroupWithMatchesWithPlayersType, GroupType, GroupWithMatchesWithPlayersType, MatchType } from "~/server/db/schema"
import FirstStageGroupCarousel from "./FirstStageGroupCarousel"
import { api } from "~/trpc/react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function GroupStage({event, formattedGroupsWithMatchesWithPlayers}: {event: EventType, formattedGroupsWithMatchesWithPlayers: formattedGroupWithMatchesWithPlayersType[]}) {

  const checkIfFirstStageIsComplete = api.event.checkIfFirstStageIsComplete.useMutation()
  const utils = api.useUtils()


  const handleEndGroupStage = async () => {
    try {
      await checkIfFirstStageIsComplete.mutateAsync({eventId: event.id});
      toast.success("Group stage completed")
    } catch (error) {
      toast.error((error as Error).message)
    }
    await utils.event.getById.invalidate({id: event.id})
  }

  return (
    <div className="flex flex-col items-center gap-[14px] p-[8px]">
      { formattedGroupsWithMatchesWithPlayers.length === 0 && 
        <div className="text-white font-rubik text-[14px] flex gap-[8px] bg-darkGray p-[8px] w-full box-shadow-small2">
          <FontAwesomeIcon icon={faCircleExclamation}  className='w-[20px] h-[20px]'/>
          <div>
            No groups found
          </div>
        </div>
      }
      { event.promptToCompleteFirstStage && !event.isFirstStageComplete &&  
        <div className="text-[12px] font-rubik flex items-center gap-[8px] bg-green text-white px-[16px] py-[4px] rounded-[4px] box-shadow-small2">
          <img src="/svgs/exclamation.svg" alt="" className="size-[24px]" />
          <button onClick={handleEndGroupStage} className="translate-y-[10%]">
            End the Group Stage
          </button>
          <img src="/svgs/twoWhiteCaretsRight.svg" alt="" className="size-[32px]" />
        </div>
      }

      { event.isFirstStageComplete && 
          <div onClick={handleEndGroupStage} className="translate-y-[10%] font-rubik text-center flex flex-col gap-[4px]">
            <div className="text-[16px]">First Stage Complete!</div>
            <div className="text-[12px]">Rounds are locked in</div>
          </div>
      }
      
      {formattedGroupsWithMatchesWithPlayers && formattedGroupsWithMatchesWithPlayers.map(group => 
        <FirstStageGroupCarousel event={event} formattedGroupWithMatchesWithPlayers={group} />
      )}
    </div>
  )
}
export default GroupStage