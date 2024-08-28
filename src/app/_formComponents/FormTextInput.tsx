function FormTextInput({placeholder}: {placeholder: string}) {
  return (
    <input type="text" placeholder={placeholder} className="h-[30px] bg-white border-[1px] border-black box-shadow-small2"/>
  )
}
export default FormTextInput