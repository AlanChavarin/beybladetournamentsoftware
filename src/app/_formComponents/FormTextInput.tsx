import { UseFormReturn } from "react-hook-form"
import FormInputError from "./FormInputError"

function FormTextInput({placeholder, name, form, dontShowError}: {placeholder: string, name: string, form: UseFormReturn<any>, dontShowError?: boolean}) {
  
    const {register, formState: {errors}} = form

  return (
    <>
      <input type="text" placeholder={placeholder} className="h-[30px] bg-white border-[1px] border-black box-shadow-small2 outline-none focus:border-[2px] focus:border-black" {...register(name)}/>
      {!dontShowError && <FormInputError errors={errors} name={name} />}
    </>
  )
}
export default FormTextInput