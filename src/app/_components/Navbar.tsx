import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";


function Navbar() {
  return (
    <div className="bg-darkGray text-white flex items-center justify-center w-full h-[71px] relative">
      <img src="/svgs/redTriangle.svg" alt="" className="absolute top-0 right-0 rotate-180"/>
      <img src="/svgs/redTriangle.svg" alt="" className="absolute top-0 left-0 rotate-90"/>
      <div className="relative">
        <Link href="/">
          <div className="font-rubik text-[14px] leading-[17px] relative z-[2] p-[4px]">
            BEYBLADE <br/>
            TOURNAMENT <br/>
            CENTER <br/>
          </div>
        </Link>
        <img src="/svgs/BigRedThingy.svg" alt="" className="absolute top-0 z-[1] w-full h-full" />
      </div>
      <div className="absolute right-[0px] top-[50%] translate-y-[-50%] p-[12px]">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <div className="font-rubik text-[10px] bg-green rounded-[4px] px-[6px] py-[4px] box-shadow-small2">
            <SignInButton />
          </div>
        </SignedOut>
      </div>
    </div>
  )
}
export default Navbar