import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


function YourMatchHistory() {
  return (
    <div className="box-shadow-small2 w-full">
        {/* label showing what group this is */}
        <div className="text-white font-rubik text-[14px] flex gap-[8px] bg-darkGray p-[4px] w-full relative">
            <div className="ml-[6px] relative z-10">Your Match History</div>
            <div className="absolute left-[4px] top-[50%] translate-y-[-50%] z-0">
                <img src="/svgs/redThingy.svg" alt="redThingy" className="w-[24px] h-[24px]" />
            </div>
        </div>
        {/* shows player standings in this group */}
        <div className="flex flex-col text-[12px] font-semibold">
            <div className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                <div className="w-[24px] text-center">1</div>
                <div className="min-w-[100px]">vs Joe Biden</div>
                <div className="bg-specialRed text-white px-[8px] h-full flex items-center justify-center w-[96px]">Win (6-4)</div>
            </div>
            <div className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                <div className="w-[24px] text-center">2</div>
                <div className="min-w-[100px]">vs Joe Biden</div>
                <div className="bg-lightGray7  px-[8px] h-full flex items-center justify-center w-[96px]">Loss (2-5)</div>
            </div>
            <div className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                <div className="w-[24px] text-center">1</div>
                <div className="min-w-[100px]">vs Joe Biden</div>
                <div className="px-[8px] h-full flex items-center justify-center w-[96px]">Pending</div>
            </div>
            <div className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                <div className="w-[24px] text-center">1</div>
                <div className="min-w-[100px]">vs Joe Biden</div>
                <div className="px-[8px] h-full flex items-center min-w-[96px]">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-[4px]" />
                  Score Conflict
                </div>
            </div>
            <div className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                <div className="w-[24px] text-center">1</div>
                <div className="min-w-[100px]">vs Joe Biden</div>
                <div className="bg-specialRed text-white px-[8px] h-full flex items-center justify-center w-[96px]">Win (6-4)</div>
            </div>
            <div className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                <div className="w-[24px] text-center">1</div>
                <div className="min-w-[100px]">vs Joe Biden</div>
                <div className="bg-specialRed text-white px-[8px] h-full flex items-center justify-center w-[96px]">Win (6-4)</div>
            </div>
            <div className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                <div className="w-[24px] text-center">1</div>
                <div className="min-w-[100px]">vs Joe Biden</div>
                <div className="bg-specialRed text-white px-[8px] h-full flex items-center justify-center w-[96px]">Win (6-4)</div>
            </div>
            <div className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                <div className="w-[24px] text-center">1</div>
                <div className="min-w-[100px]">vs Joe Biden</div>
                <div className="bg-specialRed text-white px-[8px] h-full flex items-center justify-center w-[96px]">Win (6-4)</div>
            </div>
            <div className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                <div className="w-[24px] text-center">1</div>
                <div className="min-w-[100px]">vs Joe Biden</div>
                <div className="bg-specialRed text-white px-[8px] h-full flex items-center justify-center w-[96px]">Win (6-4)</div>
            </div>
            
        </div>
    </div>
  )
}
export default YourMatchHistory