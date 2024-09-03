function GroupComponent({header, players}: {header: string, players: string[]}) {
  return (
    <div className="box-shadow-small2 w-full">
        {/* label showing what group this is */}
        <div className="text-white font-rubik text-[14px] flex gap-[8px] bg-darkGray p-[4px] w-full relative">
            <div className="ml-[6px] relative z-10">{header}</div>
            <div className="absolute left-[4px] top-[50%] translate-y-[-50%] z-0">
                <img src="/svgs/redThingy.svg" alt="redThingy" className="w-[24px] h-[24px]" />
            </div>
        </div>
        {/* shows player standings in this group */}
        <div className="flex flex-col text-[12px] font-semibold">
            {players.map((player, index) => (
                <div key={index} className="flex gap-[8px] items-center h-[24px] odd:bg-lightGray3">
                    <div className="w-[24px] text-center">{index + 1}</div>
                    <div>{player}</div>
                </div>
            ))}

        </div>
    </div>
  )
}
export default GroupComponent