import { UseFormReturn } from "react-hook-form"
import FormInputError from "./FormInputError"

function FormTimeInput({name, form}: {name: string, form: UseFormReturn<any>}) {

    const {register, formState: {errors}} = form

  return (
    <>
      <input type="time" {...register(name)} className="h-[30px] max-w-[120px] bg-white border-[1px] border-black box-shadow-small2 outline-none focus:border-[2px] focus:border-black"/>
      <FormInputError errors={errors} name={name} />
    </>
  )
}
export default FormTimeInput