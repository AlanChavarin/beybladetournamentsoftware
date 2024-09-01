import FirstStageGroupCarousel from "./FirstStageGroupCarousel"

function GroupStage() {
  return (
    <div className="flex flex-col items-center gap-[14px] p-[8px]">
        <FirstStageGroupCarousel />
        <FirstStageGroupCarousel />
    </div>
  )
}
export default GroupStage