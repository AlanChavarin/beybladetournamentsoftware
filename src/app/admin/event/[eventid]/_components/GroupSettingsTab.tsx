import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faSubtract, faUser } from "@fortawesome/free-solid-svg-icons"
import { EventType } from "~/server/db/schema"

function GroupSettingsTab({event}: {event: EventType}) {
  return (
    <div className="flex flex-col items-center gap-[14px] w-full">
        {/* Group Settings */}
        <div className="w-full box-shadow-small2">
            <div className="text-white bg-darkGray text-[14px] font-rubik font-normal p-[4px] pl-[12px]">Group Settings</div>
            <div className="flex flex-col items-center bg-lightGray3 p-[16px] font-semibold gap-[12px]">
                <div className="flex gap-[8px] max-w-[320px] w-full">
                    <div className="bg-darkGray text-white px-[12px] h-[42px] flex gap-[14px] items-center justify-start box-shadow-small2 basis-[50%]">
                        <div className="font-bold text-[24px]">2</div> 
                        <div className="text-[14px] flex-1 text-center">Group(s)</div>
                    </div>
                    <button className="bg-green hover:bg-greenHover rounded-[4px] box-shadow-small2 flex items-center justify-center flex-1">
                        <FontAwesomeIcon icon={faPlus} className="size-[20px]"/>
                    </button>
                    <button className="bg-green hover:bg-greenHover rounded-[4px] box-shadow-small2 flex items-center justify-center flex-1">
                        <FontAwesomeIcon icon={faSubtract} className="size-[20px]"/>
                    </button>
                </div>
                <div className="flex gap-[8px] max-w-[320px] w-full">
                    <div className="bg-darkGray text-white py-[4px] gap-[14px] h-[52px] flex items-center justify-start box-shadow-small2 basis-[50%] px-[12px]">
                        <div className="font-bold text-[24px]">4</div> 
                        <div className="text-[14px] text-center flex-1">Advance from <br/> each group</div>
                    </div>
                    <button className="bg-green hover:bg-greenHover rounded-[4px] box-shadow-small2 flex items-center justify-center flex-1">
                        <FontAwesomeIcon icon={faPlus} className="size-[20px]"/>
                    </button>
                    <button className="bg-green hover:bg-greenHover rounded-[4px] box-shadow-small2 flex items-center justify-center flex-1">
                        <FontAwesomeIcon icon={faSubtract} className="size-[20px]"/>
                    </button>
                </div>
                <button className="text-white bg-green hover:bg-greenHover font-semibold rounded-[4px] box-shadow-small2 w-[140px] p-[2px]">
                    Save
                </button>
            </div>
        </div>

        <div className="flex flex-col w-full font-rubik font-normal text-[14px]">
            <div className="flex flex-row odd:bg-lightGray3">
                <div className="bg-darkGray text-white basis-[35%] py-[4px] text-center">
                    Group A
                </div>
                <div className="flex items-center pl-[8px] gap-[4px]">
                    <FontAwesomeIcon icon={faUser} className="translate-y-[-10%] size-[12px]"/>
                    <div>
                        12 players
                    </div>
                </div>
            </div>
            <div className="flex flex-row odd:bg-lightGray3">
                <div className="bg-darkGray text-white basis-[35%] py-[4px] text-center">
                    Group B
                </div>
                <div className="flex items-center pl-[8px] gap-[4px]">
                    <FontAwesomeIcon icon={faUser} className="translate-y-[-10%] size-[12px]"/>
                    <div>
                        13 players
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-row font-rubik w-full text-[14px]">
            <div className="bg-darkGray text-white basis-[35%] py-[4px] flex items-center justify-center">
                Top Cut
            </div>
            <div>

                <div className="flex items-center pl-[8px] gap-[4px]">
                    <FontAwesomeIcon icon={faUser} className="translate-y-[-10%] size-[12px]"/>
                    <div>
                        8 Players
                    </div>
                </div>
                <div className="flex items-center pl-[8px] gap-[4px] text-[12px]">
                    <FontAwesomeIcon icon={faUser} className="translate-y-[-10%] size-[12px]"/>
                    <div>
                        4 from each Group
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default GroupSettingsTab