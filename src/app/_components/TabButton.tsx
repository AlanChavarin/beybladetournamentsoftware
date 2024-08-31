function TabButton({text, onClick, activeTab, color}: {text: string, onClick: () => void, activeTab: string, color: ('green' | 'gray')}) {
  return (
    <button 
    className={`
        ${color==='green' && (activeTab===text ? 'bg-darkGreen hover:bg-darkGreenHover' : 'bg-green hover:bg-greenHover')} 
        ${color==='gray' && (activeTab===text ? 'bg-lightGray1' : 'bg-lightGray2')} 
        
        ${color === 'green' && `text-white`} 
        ${color === 'gray' && `text-black`} 
        
        
        rounded-[4px] py-[4px] px-[12px] box-shadow-small2 font-semibold
      
      `}
    onClick={onClick}
    >
        {text}
    </button>
  )
}
export default TabButton