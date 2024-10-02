'use client'
import { EventType, MatchType, MatchWithPlayersType } from "~/server/db/schema"
import TopCutStageCarousel from "./TopCutStageCarousel"
import { api } from "~/trpc/react"
import { toast } from "react-toastify"


function FinalStage({event, topCutMatchesWithPlayers}: {event: EventType, topCutMatchesWithPlayers: MatchWithPlayersType[][] | undefined}) {

  const checkIfFirstStageIsComplete = api.event.checkIfFinalStageIsComplete.useMutation()
  const utils = api.useUtils()

  const handleEndFinalStage = async () => {
    try {
      await checkIfFirstStageIsComplete.mutateAsync({eventId: event.id});
      toast.success("Final stage completed")
    } catch (error) {
      toast.error((error as Error).message)
    }
    await utils.event.getById.invalidate({id: event.id})
    await utils.match.getTopCutMatchesWithPlayers.invalidate({eventId: event.id})
    await utils.player.getPlayersByEventId.invalidate({eventId: event.id})
    await utils.group.getGroupsWithPlayersByEventId.invalidate({eventId: event.id})
    await utils.group.getGroupsWithMatchesWithPlayersByEventId.invalidate({eventId: event.id})
  }

  return (
    <div className="flex flex-col items-center gap-[14px] p-[8px]">
      {
        event.promptToCompleteFinalStage && !event.isFinalStageComplete && 
        <div className="text-[12px] font-rubik flex items-center gap-[8px] bg-green text-white px-[16px] py-[4px] rounded-[4px] box-shadow-small2">
          <img src="/svgs/exclamation.svg" alt="" className="size-[24px]" />
          <button onClick={handleEndFinalStage} className="translate-y-[10%]">
            End the Final Stage
          </button>
          <img src="/svgs/twoWhiteCaretsRight.svg" alt="" className="size-[32px]" />
        </div>
      }
      {event.isFinalStageComplete && 
        <div className="text-[16px] font-rubik text-center flex flex-col gap-[4px]">
          <div className="text-[16px]">Final Stage Complete!</div>
          <div className="text-[12px]">Final results are locked in</div>
        </div>
      }
      <TopCutStageCarousel event={event} topCutMatchesWithPlayers={topCutMatchesWithPlayers || []} />
    </div>
  )
}
export default FinalStage