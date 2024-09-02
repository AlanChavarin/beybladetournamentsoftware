import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import GroupComponent from "~/app/_components/GroupComponent"

function StandingsTab({dontShowCode}: {dontShowCode?: boolean}) {
  return (
    <div className="flex flex-col items-center gap-[14px] p-[8px]">
      {
        !dontShowCode && 
          <div className="text-white font-rubik text-[14px] flex gap-[8px] bg-darkGray p-[8px] w-full box-shadow-small2">
            <FontAwesomeIcon icon={faCircleExclamation}  className='w-[20px] h-[20px]'/>
            <div>
                Check-in code: 364
            </div>
          </div>
      }

        <GroupComponent header="Group A" />
        <GroupComponent header="Group B" />
    </div>

  )
}
export default StandingsTab