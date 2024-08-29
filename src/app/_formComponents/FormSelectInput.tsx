'use client'
import { useState, SyntheticEvent } from "react"
import { UseFormReturn } from "react-hook-form"
import FormInputError from "./FormInputError"

function FormSelectInput({placeholder, name, form, data}: {placeholder: string | undefined, name: string, form: UseFormReturn<any>, data: string[] | undefined}) {
  const {register, setValue, formState: {errors}} = form
  const [dropdown, setDropdown] = useState<boolean>(false)
  var a = process.browser && document.getElementsByClassName(name)

  const onFilter = (e: SyntheticEvent) => {
    // @ts-ignore
    var filter1 = e.target.value.toUpperCase()
    // @ts-ignore
    for (var i = 0; i < a.length; i++) {
      // @ts-ignore
      var txtValue = a[i].textContent;
      if (txtValue && txtValue.toUpperCase().indexOf(filter1) > -1) {
        // @ts-ignore
        a[i].style.display = ""
      } else {
        // @ts-ignore
        a[i].style.display = "none"
      }
    }
  }

  const onFocus = () => {
    setDropdown(true)
  }

  const onBlur = () => {
    setTimeout(() => setDropdown(false), 100)
  }

  return (
    <div className="relative w-[100%]">
      <input 
        placeholder={placeholder} 
        className="focus:outline-none focus:border-[2px] w-[100%] rounded-none flex flex-row items-center bg-white border-[1px] border-black px-[8px] py-[1px] relative box-shadow-small2 "
        onFocus={() => onFocus()} 
        {...register(name, {
          onChange: (e: SyntheticEvent) => {onFilter(e)},
          onBlur: () => {onBlur()},
        })}
      />
      <span className="absolute border-[2px] border-black max-h-[150px] overflow-y-scroll bg-white z-[10] box-shadow-extra-small w-[100%]" style={{visibility: dropdown ? "visible" : "hidden"}}>
        {data?.map((item) => (<div onClick={() => setValue(name, item)} className={`hover:bg-custom-whiteHover cursor-pointer ${name} text-[16px] font-normal`} key={item}>{item}</div>))}
      </span>

      <FormInputError errors={errors} name={name} />
    </div>
  )
}
export default FormSelectInput