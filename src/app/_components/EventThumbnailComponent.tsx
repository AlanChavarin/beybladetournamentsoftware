import DateComponent from "./DateComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faEarthAmericas, faClock, faUser, faAnglesRight} from "@fortawesome/free-solid-svg-icons"

function EventThumbnailComponent({checkin}: {checkin?: boolean}) {
  return (
    <div className="flex flex-row">
        <DateComponent/>

        <div className="flex flex-col font-bold justify-between py-[4px] px-[12px] border-b-[1px] border-lightGray5 w-full relative">
            <div className="text-[12px]">
                BBX Tabletop Tavern Hasbro Stadium
            </div>
            <div className="text-[10px] text-lightGray4 flex flex-row gap-[4px]">
                <FontAwesomeIcon icon={faEarthAmericas} className="w-[13px] h-[13px] text-red"/>
                <div>Chula Vista, California</div>
            </div>
            <div className="text-[10px] text-lightGray4 flex flex-row gap-[16px]">
                <div className="flex flex-row gap-[4px]">
                    <img src="/svgs/sword.svg" alt="" className="w-[15px] h-[15px]"/>
                    <div>BBX</div>
                </div>
                <div className="flex flex-row gap-[4px]">
                    <FontAwesomeIcon icon={faClock} className="w-[13px] h-[13px] text-red"/>
                    <div>2:00PM</div>
                </div>
                <div className="flex flex-row gap-[4px]">
                    <FontAwesomeIcon icon={faUser} className="w-[13px] h-[13px] text-red"/>
                    <div>23 Players</div>
                </div>
            </div>

            { checkin && 
                <div className="bg-green h-[20px] w-[120px] absolute right-0 top-[22px] text-white text-[12px] font-semibold flex items-center pl-[4px] gap-[4px]">
                        <div>
                            Check in Now 
                        </div>
                    <FontAwesomeIcon icon={faAnglesRight} className="w-[12px] h-[12px]"/>
                </div>
            }
        </div>
    </div>
  )
}
export default EventThumbnailComponent