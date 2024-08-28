import FontAwesomeIcon from "@fortawesome/react-fontawesome"

function Navbar() {
  return (
    <div className="bg-darkGray text-white flex items-center justify-center w-full h-[71px] relative">
      <img src="/svgs/redTriangle.svg" alt="" className="absolute top-0 right-0 rotate-180"/>
      <img src="/svgs/redTriangle.svg" alt="" className="absolute top-0 left-0 rotate-90"/>
      <div className="relative">
        <div className="font-rubik text-[14px] leading-[17px] relative z-[2] p-[4px]">
          BEYBLADE <br/>
          TOURNAMENT <br/>
          CENTER <br/>
        </div>
        <img src="/svgs/BigRedThingy.svg" alt="" className="absolute top-0 z-[1] w-full h-full" />
      </div>
    </div>
  )
}
export default Navbar