'use client'

import FormDateInput from "../_formComponents/FormDateInput"
import FormSelectInput from "../_formComponents/FormSelectInput"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod"
import FormTextInput from "../_formComponents/FormTextInput"
import FormTimeInput from "../_formComponents/FormTimeInput"
import CustomRadio from "../_formComponents/FormCustomRadio"
import FormError from "../_formComponents/FormError"
import { api } from "~/trpc/react"
import { toast } from "react-toastify"

const formatOptions = ['BBX', 'Metal Fight', 'Burst', 'Plastic']

const deckListRequirementOptions = {
  "Only for top 4": "top4",
  "Everyone in top cut": "topCut",
  "Everyone in the event": "allPlayers"
}

const formSchema = z.object({
  name: z.string().min(5, "Event name is required, min 5 characters"),
  format: z.string(),
  date: z.string().pipe(z.coerce.date()),
  location: z.string().min(1, "Location is required"),
  time: z.string().refine((val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
    message: "Invalid time format. Use HH:MM (24-hour format)",
  }),
  checkInTime: z.string().refine((val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
    message: "Invalid time format. Use HH:MM (24-hour format)",
  }),
  deckListRequirement: z.enum(["top4", "topCut", "allPlayers"]),
})

type FormSchemaType = z.infer<typeof formSchema>

function page() {
    
    const form = useForm<FormSchemaType>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "test event 1",
        format: "BBX",
        date: new Date("2024-07-20"),
        location: "Chula Vista, CA",
        time: "12:00",
        checkInTime: "11:00",
        deckListRequirement: "top4",
      },
    });

    const {control, register, handleSubmit, setValue, getValues, reset, watch, formState: {errors, isSubmitting}} = form
    
    const createEventMutation = api.event.create.useMutation({
        onSuccess: () => {

            toast.success("Event created successfully")
        },
        onError: (error) => {
            toast.error("Error creating event, check console for more details")
            console.error(error)
        }
    })


    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        const convertTimeToDate = (timeString: string) => {
            const [hours, minutes] = timeString.split(':') ? timeString.split(':') : [0, 0]
            const date = new Date()
            // @ts-ignore
            date.setHours(hours, minutes)
            return date;
        };

        const eventData = {
            ...data,
            time: convertTimeToDate(data.time),
            checkInTime: convertTimeToDate(data.checkInTime)
        };

        createEventMutation.mutate(eventData)
    }

  return (
    <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-lightGray3 flex flex-col m-[16px] w-[100%] max-w-[400px] box-shadow font-bold">
            <div className="text-white bg-darkGray flex justify-center items-center font-normal font-rubik h-[32px] text-[14px]">
                Create Event
            </div>
            <div className="flex flex-col gap-[8px] p-[12px] text-[16px]">
                <FormError errors={errors}/>
                <div className="flex flex-col gap-[4px]">
                    <label>Name:</label>
                    <FormTextInput placeholder="Event Name" name="name" form={form}/>
                </div>
                <div className="flex flex-col gap-[4px]">
                    <label>Format:</label>
                    <FormSelectInput data={formatOptions} placeholder="BBX" name="format" form={form}/>
                </div>
                <div className="flex flex-col gap-[4px]">
                    <label>Date:</label>
                    <FormDateInput name="date" form={form}/>
                </div>
                <div className="flex flex-col gap-[4px]">
                    <label>Location:</label>
                    <FormTextInput placeholder="Event Location" name="location" form={form}/>
                </div>
                <div className="flex flex-col gap-[4px]">
                    <label>Time:</label>
                    <FormTimeInput name="time" form={form}/>
                </div>
                <div className="flex flex-col gap-[4px]">
                    <label>Check-In Time:</label>
                    <FormTimeInput name="checkInTime" form={form}/>
                </div>
                <div className="flex flex-col gap-[4px]">
                    <label>Deck List Requirement:</label>
                    <div className="w-[220px]">
                        <CustomRadio options={deckListRequirementOptions} name="deckListRequirement" form={form} flexDirection="col"/>
                    </div>
                </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-green hover:bg-darkGreen text-white font-semibold h-[32px] rounded-[4px] w-[200px] mx-auto my-[32px] box-shadow-small2">
                {isSubmitting ? "Submitting..." : "Post Event"}
            </button>
        </form>
    </div>
  )
}
export default page