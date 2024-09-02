function PairingComponent() {
  return (
    <div className="w-full h-[310px] flex flex-col box-shadow-small">
        <div className="relative flex flex-col justify-between bg-darkGray p-[12px] gap-[4px]">
            <div className="pl-[8px] text-white font-rubik text-[32px] leading-[40px]">
                Table 7
            </div>
            {/* generate a horizontal white line */}
            <div className="w-[220px] h-[1px] bg-white "></div>
            <div className="text-white font-rubik text-[16px] pl-[12px]">
                Match 3/11
            </div>
            <div className="absolute right-[32px] top-[50%] translate-y-[-50%]">
                <img src="/svgs/swordWhite.svg" alt="sword" className="size-[40px]"/>
            </div>
        </div>
        
        <div className="relative w-full h-full bg-lightGray3 flex flex-col justify-center items-center font-rubik text-[20px] gap-[8px] text-shadow">
            {/* flex items */}
            <div>Donald Trump</div>
            <div className="text-[16px]">VS</div>
            <div>Kamala Karris</div>
            <button className="bg-green text-white font-sans font-semibold text-[12px] px-[32px] py-[4px] my-[16px] rounded-[4px] box-shadow-small2">
                Enter Score
            </button>

            {/* black triangles, absolute positioning */}
            <img src="/svgs/blackTriangle.svg" className="size-[13px] absolute right-0 top-0"/>
            <img src="/svgs/blackTriangle.svg" className="size-[13px] absolute right-0 bottom-0 rotate-[90deg]"/>
            <img src="/svgs/blackTriangle.svg" className="size-[13px] absolute left-0 top-0 rotate-[270deg]"/>
            <img src="/svgs/blackTriangle.svg" className="size-[13px] absolute left-0 bottom-0 rotate-[180deg]"/>

        </div>
    </div>
  )
}
export default PairingComponent