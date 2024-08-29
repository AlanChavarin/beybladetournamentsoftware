import { UseFormReturn } from "react-hook-form"
import FormInputError from "./FormInputError"

function FormDateInput({name, form}: {name: string, form: UseFormReturn<any>}) {

  const {register, formState: {errors}} = form

  return (
    <>
      <input type="date" {...register(name)} className="h-[30px] max-w-[200px] bg-white border-[1px] border-black box-shadow-small2 outline-none focus:border-[2px] focus:border-black"/>
      <FormInputError errors={errors} name={name} />
    </>
  )
}
export default FormDateInput