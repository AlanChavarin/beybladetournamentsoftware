'use client'
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormTextInput from "~/app/_formComponents/FormTextInput"
import { api } from "~/trpc/react"
import { toast } from "react-toastify"
import FormError from "~/app/_formComponents/FormError"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
})

type FormSchemaType = z.infer<typeof formSchema>

function AddPartcipantForm({eventid}: {eventid: number}) {
    const addPlayer = api.event.addPlayer.useMutation()
    const utils = api.useUtils()

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = form

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {

        try {
            await addPlayer.mutateAsync({
                id: eventid,
                player: data.name
            }) 
            utils.event.getById.invalidate({id: eventid})
            reset()
        } catch (error) {
            toast.error((error as Error).message)
        }

    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full box-shadow-small2">
        <div className="bg-darkGray text-white text-[14px] font-rubik font-normal p-[4px] pl-[12px]">Add Participants</div>
        <div className="flex flex-row gap-[16px] items-center justify-center bg-lightGray3 min-h-[64px]">
            <FormTextInput dontShowError={true} form={form} name="name" placeholder="Username" />
            <button type="submit" disabled={isSubmitting} className="bg-green hover:bg-darkGreen text-white font-semibold h-[28px] w-[75px] rounded-[4px] text-[12px] box-shadow-small2">
                {isSubmitting ? "Submitting..." : "Add"}
            </button>
            <FormError errors={errors} />
        </div>
    </form>
  )
}
export default AddPartcipantForm