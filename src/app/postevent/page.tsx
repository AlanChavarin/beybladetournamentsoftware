import FormDateInput from "../_formComponents/FormDateInput"
import FormTextInput from "../_formComponents/FormTextInput"

function page() {
  return (
    <div className="">
        <form className="bg-lightGray6 flex flex-col m-[16px] max-w-[400px] box-shadow font-bold">
            <div className="text-white bg-darkGray flex justify-center items-center font-normal font-rubik h-[32px] text-[18px]">
                Create Event
            </div>
            <div className="flex flex-col gap-[8px] p-[12px] text-[16px]">
                <div className="flex flex-col gap-[4px]">
                    <label>Format:</label>
                    <FormTextInput placeholder="BBX"/>
                </div>
                <div className="flex flex-col gap-[4px]">
                    <label>Date:</label>
                    <FormDateInput/>
                </div>
            </div>
        </form>
    </div>
  )
}
export default page