import { ErrorMessage } from "@hookform/error-message"
import { FieldErrors } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

function FormInputError({errors, name}: {errors: FieldErrors<any>, name: string}) {
  return (
    <ErrorMessage errors={errors} name={name} render={({message}) => 
        <div className="text-red-600 flex items-center gap-[8px] text-[10px]">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-600 w-[16px] h-[16px]"/>
            <div>
              {message}
            </div>
        </div>
      }/>
  )
}
export default FormInputError