import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCalendar} from "@fortawesome/free-regular-svg-icons"

function DateComponent() {
  return (
    <div className="text-white bg-darkGray font-bold min-w-[64px] min-h-[64px] items-center justify-center flex flex-col">
        <div className="text-[12px]">Aug</div>
        <div className="relative p-[4px] text-[10px] w-[31px] h-[31px]">
            <FontAwesomeIcon icon={faCalendar} className="absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] w-[31px] h-[31px]"/>
            <div className="absolute top-[11px] right-[50%] translate-x-[50%]">12</div>
        </div>
    </div>
  )
}
export default DateComponent