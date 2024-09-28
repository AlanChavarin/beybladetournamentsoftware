'use client'
import { faX, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EventType, PlayerType } from "~/server/db/schema"
import { useEffect, useState } from "react"
import { api } from "~/trpc/react"
import { toast } from "react-toastify"

function GroupComponent({event, header, players, showDeleteButton, showScores}: {event?: EventType, header: string, players: PlayerType[], showDeleteButton?: boolean, showScores?: boolean}) {
	const [playerToDelete, setPlayerToDelete] = useState<string>("")
    const removePlayerFromEvent = api.player.removePlayerFromEventViaUsername.useMutation()
    const utils = api.useUtils()
	const handleDeleteClick = (playerName: string | null) => {
		setPlayerToDelete(playerName ?? "")
	}

	const handleConfirmDelete = () => {
        if (playerToDelete && event) {
            removePlayerFromEvent.mutate({
                eventId: event.id,
                playerName: playerToDelete
            })
            utils.event.getById.invalidate({id: event.id})
            utils.player.getPlayersByEventId.invalidate({eventId: event.id})
            utils.group.getGroupsWithPlayersByEventId.invalidate({eventId: event.id})
            toast.success(`Player ${playerToDelete} removed from event ${event.name}`)
        } else {
            toast.error("Player or event not found")
        }
		setPlayerToDelete("")
	}

	const handleCancelDelete = () => {
		setPlayerToDelete("")
	}

    useEffect(() => {
        console.log("event is first stage complete", event?.isFirstStageComplete)
    }, [event?.isFirstStageComplete])

	return (
		<div className="box-shadow-small2 w-full">
			{/* label showing what group this is */}
			<div className="text-white font-rubik text-[14px] flex gap-[8px] bg-darkGray p-[4px] w-full relative">
				<div className="ml-[6px] relative z-10 flex items-center">
                    <div className="w-[150px]">
                        {header}
                    </div>
                    {showScores && <div className="w-[40px] font-sans text-[12px] font-semibold">Wins</div>}
                    {showScores && <div className="w-[40px] font-sans text-[12px] font-semibold">Score</div>}
                    {showScores && event?.isFirstStageComplete && <div className="w-[40px] font-sans text-[12px] font-semibold">Advancing</div>}
                </div>
				<div className="absolute left-[4px] top-[50%] translate-y-[-50%] z-0">
					<img src="/svgs/redThingy.svg" alt="redThingy" className="w-[24px] h-[24px]" />
				</div>
			</div>
			{/* shows player standings in this group */}
			<div className="flex flex-col text-[12px] font-semibold">
				{players.map((player, index) => (
					<div key={index} className="flex gap-[8px] items-center justify-between h-[24px] odd:bg-lightGray3">
						<div className="flex items-center">
							<div className="w-[24px] text-center">{index + 1}</div>
							<div className="w-[140px]">{player.name}</div>
                            {showScores && <div className="w-[40px]">{player.numberOfWins}</div>}
                            {showScores && <div className="w-[40px]">{player.totalScore}</div>}
                            {showScores && event?.isFirstStageComplete && event.howManyFromEachGroupAdvance && event.howManyFromEachGroupAdvance > index && <div className="w-[40px]">Yes</div>}
						</div>
						{showDeleteButton && <button onClick={() => handleDeleteClick(player.name)} className="mr-[6px] px-[12px] bg-specialRed rounded-[4px] box-shadow-small3 text-white">
							<FontAwesomeIcon icon={faX} />
						</button>}
					</div>
				))}
			</div>
			{playerToDelete && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-lightGray3 box-shadow-small2 w-full max-w-[300px]">
						<div className="bg-darkGray text-white text-[14px] font-rubik font-normal p-[4px] pl-[12px] flex items-center">
							<div className="relative h-full w-[24px]">
								<img src="/svgs/redThingy.svg" alt="redThingy" className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
								<FontAwesomeIcon icon={faExclamationTriangle} className="text-[20px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 text-white" />
							</div>
							<span className="ml-[8px]">Confirm Removal</span>
						</div>
						<div className="p-[16px] flex flex-col gap-[16px]">
							<div className="flex items-center gap-[8px]">
								<p className="text-[14px] font-semibold">Are you sure you want to remove {playerToDelete}?</p>
							</div>
							<div className="flex justify-end gap-[8px]">
								<button onClick={handleCancelDelete} className="bg-lightGray1 hover:bg-lightGray4 text-white font-semibold h-[28px] w-[75px] rounded-[4px] text-[12px] box-shadow-small2">Cancel</button>
								<button onClick={handleConfirmDelete} className="bg-specialRed hover:bg-red-700 text-white font-semibold h-[28px] w-[75px] rounded-[4px] text-[12px] box-shadow-small2">Delete</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
export default GroupComponent





{/* <div className="text-white font-rubik text-[14px] flex gap-[8px] bg-darkGray p-[4px] w-full relative">
    <div className="ml-[6px] relative z-10">{header}</div>
    <div className="absolute left-[4px] top-[50%] translate-y-[-50%] z-0">
        <img src="/svgs/redThingy.svg" alt="redThingy" className="w-[24px] h-[24px]" />
    </div>
</div>
{/* shows player standings in this group */}
{/* <div className="flex flex-col text-[12px] font-semibold">
    {players.map((player, index) => (
        <div key={index} className="flex gap-[8px] items-center justify-between h-[24px] odd:bg-lightGray3">
            <div className="flex gap-[8px] items-center">
                <div className="w-[24px] text-center">{index + 1}</div>
                <div>{player.name}</div>
                <div>Wins: {player.numberOfWins}</div>
                <div>Score: {player.totalScore}</div>
            </div>
            {showDeleteButton && <button onClick={() => handleDeleteClick(player.name)} className="mr-[6px] px-[12px] bg-specialRed rounded-[4px] box-shadow-small3 text-white">
                <FontAwesomeIcon icon={faX} />
            </button>}
        </div>
    ))}
</div> */}