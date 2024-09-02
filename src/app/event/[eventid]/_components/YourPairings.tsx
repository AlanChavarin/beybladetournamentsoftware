import PairingComponent from "./PairingComponent"
import YourMatchHistory from "./YourMatchHistory"

function YourPairings() {
  return (
    <div className="flex flex-col gap-[12px] px-[12px]">
        <PairingComponent />
        <YourMatchHistory />
    </div>
  )
}
export default YourPairings