import { MatchType, MatchWithPlayersType } from "~/server/db/schema"
import TopCutStageCarousel from "./TopCutStageCarousel"


function FinalStage({topCutMatchesWithPlayers}: {topCutMatchesWithPlayers: MatchWithPlayersType[][] | undefined}) {
  return (
    <div className="flex flex-col items-center gap-[14px] p-[8px]">
        <TopCutStageCarousel topCutMatchesWithPlayers={topCutMatchesWithPlayers || []} />
    </div>
  )
}
export default FinalStage