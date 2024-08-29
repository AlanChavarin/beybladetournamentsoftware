
import { FieldErrors } from "react-hook-form"

function FormError({errors}: {errors: FieldErrors<any>}) {
  return (<>
        {Object.keys(errors).map((key) => {
            // @ts-ignore
            const error = errors[key as keyof FormData] 
            return (
                <div key={key} className="text-red-600 text-center text-[10px]">
                    {key}: {error?.message?.toString()}
                </div>
            )
        })}
    </>
  )
}
export default FormError