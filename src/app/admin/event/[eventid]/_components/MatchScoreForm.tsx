'use client'
import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import { MatchWithPlayersType } from "~/server/db/schema"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "~/trpc/react"
import { toast } from "react-toastify"
import { useEffect } from "react"

const formSchema = z.object({
    player1Score: z.number().min(0),
    player2Score: z.number().min(0),
})

type FormSchemaType = z.infer<typeof formSchema>

function MatchScoreForm({openMatch, setOpenMatch}: {openMatch: MatchWithPlayersType | undefined, setOpenMatch: (match: MatchWithPlayersType | undefined) => void}) {

    const updateMatch = api.match.setMatchResult.useMutation()
    const utils = api.useUtils()

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            player1Score: openMatch?.player1Score ?? 0,
            player2Score: openMatch?.player2Score ?? 0,
        }
    })

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, getValues, watch } = form

    const handleScoreChange = (player: "player1" | "player2", score: number) => {
        // make sure that the score cant be negative
        if(score < 0){
            return
        }
        setValue(player === "player1" ? "player1Score" : "player2Score", score)
    }

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        if(!openMatch?.eventId) return
        try {
            await updateMatch.mutateAsync({
                matchId: openMatch.id,
                eventId: openMatch.eventId,
                player1Id: openMatch.player1.id,
                player2Id: openMatch.player2.id,
                player1Score: data.player1Score,
                player2Score: data.player2Score,

            })
            utils.match.getMatchesByEventId.invalidate({eventId: openMatch.eventId})
            utils.group.getGroupsWithMatchesWithPlayersByEventId.invalidate({eventId: openMatch.eventId})
            setOpenMatch(undefined)
        } catch (error) {
            toast.error((error as Error).message)
        }
    }

    useEffect(() => {
        setValue("player1Score", openMatch?.player1Score ?? 0)
        setValue("player2Score", openMatch?.player2Score ?? 0)
    }, [openMatch])

  return (
    <>
    {openMatch && (
        <div className=" absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-lightGray3 box-shadow-small2 max-w-[95%] w-[350px]">
                <div className="font-rubik text-[14px] bg-darkGray text-white py-[4px] px-[8px] flex justify-between items-center">
                    <div>Enter Match Score</div>
                    <FontAwesomeIcon icon={faX} className='text-[16px] cursor-pointer' onClick={() => setOpenMatch(undefined)}/>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[8px] p-[16px] items-center">
                    <div className='flex flex-row gap-[8px]'>
                        <div className='text-[16px] flex items-center gap-[8px] w-[150px] min-h-[50px] bg-darkGray  text-white px-[4px] py-[2px] box-shadow-small2'>
                            <div className='text-[24px] px-[12px]'>
                                {watch("player1Score")}
                            </div>
                            <div className='font-semibold'>
                                {openMatch.player1?.name}
                            </div>
                        </div>
                        <button type='button' onClick={() => handleScoreChange("player1", getValues("player1Score") + 1)} className='bg-green w-[70px] h-[50px] rounded-[4px] flex items-center justify-center box-shadow-small2'>
                            <FontAwesomeIcon icon={faPlus} className='text-[24px]'/>
                        </button>
                        <button type='button' onClick={() => handleScoreChange("player1", getValues("player1Score") - 1)} className='bg-green w-[70px] h-[50px] rounded-[4px] flex items-center justify-center box-shadow-small2'>
                            <FontAwesomeIcon icon={faMinus} className='text-[24px]'/>
                        </button>
                    </div>
                    <div className='flex flex-row gap-[8px]'>
                        <div className='text-[16px] flex items-center gap-[8px] w-[150px] min-h-[50px] bg-darkGray  text-white px-[4px] py-[2px] box-shadow-small2'>
                            <div className='text-[24px] px-[12px]'>
                                {watch("player2Score")} 
                            </div>
                            <div className='font-semibold'>
                                {openMatch.player2?.name}
                            </div>
                        </div>
                        <button type='button' onClick={() => handleScoreChange("player2", getValues("player2Score") + 1)} className='bg-green w-[70px] h-[50px] rounded-[4px] flex items-center justify-center box-shadow-small2'>
                            <FontAwesomeIcon icon={faPlus} className=' text-[24px]'/>
                        </button>
                        <button type='button' onClick={() => handleScoreChange("player2", getValues("player2Score") - 1)} className='bg-green w-[70px] h-[50px] rounded-[4px] flex items-center justify-center box-shadow-small2'>
                            <FontAwesomeIcon icon={faMinus} className=' text-[24px]'/>
                        </button>
                    </div>
                    <button type='submit' className='bg-green font-semibold w-full h-[28px] rounded-[4px] text-white text-[14px] box-shadow-small2 max-w-[150px] my-[16px]'>
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>

                </form>
            </div>
        </div>
    )}
    </>
  )
}

export default MatchScoreForm