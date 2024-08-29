
import { UseFormReturn } from "react-hook-form"
import FormInputError from "./FormInputError"

interface OptionsType {
    [key: string]: any;  //{displayValue: ActualValueThatGoesInState}
  }

function CustomRadio({options, form, name, flexDirection}: {options: OptionsType, form: UseFormReturn<any>, name: string, flexDirection?: ('row' | 'col')}) {
  const {setValue, watch, formState: {errors}} = form

  const handleClick = (value: any) => {
    setValue(name, value)
  }

  return (
    <div className={`flex ${flexDirection ? `flex-${flexDirection}` : 'flex-row'} gap-[8px] flex-wrap`}>
        {Object.keys(options).map(key => <div key={key}>
            {watch(name) === options[key] || JSON.stringify(watch(name)) === JSON.stringify(options[key]) ? 
                <div onClick={() => handleClick(options[key])} className="cursor-pointer h-[32px] px-[6px] border-[1px] border-black bg-green box-shadow-small2 flex items-center justify-center">
                    {key}
                </div>
                :
                <div onClick={() => handleClick(options[key])} className="cursor-pointer h-[32px] px-[6px] border-[1px] border-black bg-white box-shadow-small2 flex items-center justify-center">
                    {key}
                </div>            
            }
        </div>)}
        <FormInputError errors={errors} name={name} />
    </div>
  )
}
export default CustomRadio