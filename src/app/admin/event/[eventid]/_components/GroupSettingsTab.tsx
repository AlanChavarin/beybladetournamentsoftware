'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faSubtract, faUser } from "@fortawesome/free-solid-svg-icons"
import { EventType, GroupType } from "~/server/db/schema"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "~/trpc/react"
import { toast } from "react-toastify"

const formSchema = z.object({
    numOfGroups: z.number().min(1, "Number of groups is required"),
    advanceFromEachGroup: z.number().min(1, "Advance from each group is required"),
})

type FormSchemaType = z.infer<typeof formSchema>


function GroupSettingsTab({groups, event}: {groups: GroupType[], event: EventType}) {
    const updateEvent = api.event.updateGroupSettings.useMutation()
    const createMatches = api.match.createMatchesBasedOnEvent.useMutation()
    const utils = api.useUtils()

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            numOfGroups: event.numOfGroups ?? 2,
            advanceFromEachGroup: event.howManyFromEachGroupAdvance ?? 4,
        }
    })

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = form

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        try {
            await updateEvent.mutateAsync({
                id: event.id,
                numOfGroups: data.numOfGroups,
                howManyFromEachGroupAdvance: data.advanceFromEachGroup,
            })
            utils.event.getById.invalidate({id: event.id})
            utils.group.getGroupsByEventId.invalidate({eventId: event.id})
            utils.group.getGroupsWithPlayersByEventId.invalidate({eventId: event.id})
            utils.group.getGroupsWithMatchesWithPlayersByEventId.invalidate({eventId: event.id})
            await createMatches.mutateAsync({eventId: event.id})
        } catch (error) {
            toast.error((error as Error).message)
        }
    }

  return (
    <div className="flex flex-col items-center gap-[14px] w-full">
        {/* Group Settings */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full box-shadow-small2">
            <div className="text-white bg-darkGray text-[14px] font-rubik font-normal p-[4px] pl-[12px]">
                Group Settings
            </div>
            <div className="flex flex-col items-center bg-lightGray3 p-[16px] font-semibold gap-[12px]">
                <div className="flex gap-[8px] max-w-[320px] w-full">
                    <div className="bg-darkGray text-white px-[12px] h-[42px] flex gap-[14px] items-center justify-start box-shadow-small2 basis-[50%]">
                        <div className="font-bold text-[24px]">{form.watch('numOfGroups')}</div> 
                        <div className="text-[14px] flex-1 text-center">Group(s)</div>
                    </div>
                    <button type="button" className="bg-green hover:bg-greenHover rounded-[4px] box-shadow-small2 flex items-center justify-center flex-1" onClick={() => form.setValue('numOfGroups', form.getValues('numOfGroups') + 1)}>
                        <FontAwesomeIcon icon={faPlus} className="size-[20px]"/>
                    </button>
                    <button type="button" className="bg-green hover:bg-greenHover rounded-[4px] box-shadow-small2 flex items-center justify-center flex-1" onClick={() => form.setValue('numOfGroups', form.getValues('numOfGroups') - 1)}>
                        <FontAwesomeIcon icon={faSubtract} className="size-[20px]"/>
                    </button>
                </div>
                <div className="flex gap-[8px] max-w-[320px] w-full">
                    <div className="bg-darkGray text-white py-[4px] gap-[14px] h-[52px] flex items-center justify-start box-shadow-small2 basis-[50%] px-[12px]">
                        <div className="font-bold text-[24px]">{form.watch('advanceFromEachGroup')}</div> 
                        <div className="text-[14px] text-center flex-1">Advance from <br/> each group</div>
                    </div>
                    <button type="button" className="bg-green hover:bg-greenHover rounded-[4px] box-shadow-small2 flex items-center justify-center flex-1" onClick={() => form.setValue('advanceFromEachGroup', form.getValues('advanceFromEachGroup') + 1)}>
                        <FontAwesomeIcon icon={faPlus} className="size-[20px]"/>
                    </button>
                    <button type="button" className="bg-green hover:bg-greenHover rounded-[4px] box-shadow-small2 flex items-center justify-center flex-1" onClick={() => form.setValue('advanceFromEachGroup', form.getValues('advanceFromEachGroup') - 1)}>
                        <FontAwesomeIcon icon={faSubtract} className="size-[20px]"/>
                    </button>
                </div>
                <button type="submit" className="text-white bg-green hover:bg-greenHover font-semibold rounded-[4px] box-shadow-small2 w-[140px] p-[2px]">
                    {
                        isSubmitting ? "Saving..." : "Save"
                    }
                </button>
            </div>
        </form>

        {/* displays data */}

        <div className="flex flex-col w-full font-rubik font-normal text-[14px] box-shadow-small2">
            { groups && groups.map(group => 
                <div className="flex flex-row odd:bg-lightGray3">
                    <div className="bg-darkGray text-white basis-[35%] py-[4px] text-center">
                        Group {group.groupLetter}
                    </div>
                    <div className="flex items-center pl-[8px] gap-[4px]">
                        <FontAwesomeIcon icon={faUser} className="translate-y-[-10%] size-[12px]"/>
                        <div>
                            {group.numOfPlayers} players
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="flex flex-row font-rubik w-full text-[14px] box-shadow-small2">
            <div className="bg-darkGray text-white basis-[35%] py-[4px] flex items-center justify-center">
                Top Cut
            </div>
            <div>

                <div className="flex items-center pl-[8px] gap-[4px]">
                    <FontAwesomeIcon icon={faUser} className="translate-y-[-10%] size-[12px]"/>
                    <div>
                        {event.numOfGroups && event.howManyFromEachGroupAdvance ? event.numOfGroups * event.howManyFromEachGroupAdvance : 0} Players
                    </div>
                </div>
                <div className="flex items-center pl-[8px] gap-[4px] text-[12px]">
                    <FontAwesomeIcon icon={faUser} className="translate-y-[-10%] size-[12px]"/>
                    <div>
                        {event.howManyFromEachGroupAdvance} from each Group
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default GroupSettingsTab