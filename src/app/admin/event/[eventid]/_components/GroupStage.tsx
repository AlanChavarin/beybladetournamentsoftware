import { formattedGroupWithMatchesWithPlayersType, GroupType, GroupWithMatchesWithPlayersType, MatchType } from "~/server/db/schema"
import FirstStageGroupCarousel from "./FirstStageGroupCarousel"

function GroupStage({formattedGroupsWithMatchesWithPlayers}: {formattedGroupsWithMatchesWithPlayers: formattedGroupWithMatchesWithPlayersType[]}) {
  return (
    <div className="flex flex-col items-center gap-[14px] p-[8px]">
      {formattedGroupsWithMatchesWithPlayers && formattedGroupsWithMatchesWithPlayers.map(group => 
        <FirstStageGroupCarousel formattedGroupWithMatchesWithPlayers={group} />
      )}
        
    </div>
  )
}
export default GroupStage