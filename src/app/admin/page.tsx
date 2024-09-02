
import Link from 'next/link'
import EventsContainer from '../_homePageComponents/EventsContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons'


async function page() {

  return (
    <div className='flex flex-col items-center gap-[16px] p-[8px]'>

        <div className='text-[14px] text-white bg-darkGray font-rubik w-full box-shadow-small2 text-center py-[8px]'>
            Admin Dashboard
        </div>

        <Link href="/admin/postevent" className="bg-green text-white py-[8px] px-[24px] rounded-[4px] box-shadow-small2 font-rubik text-[12px] flex items-center justify-center gap-[8px] min-w-[180px]">  
            Post Event
        </Link>

        <div className='text-[12px] text-white bg-darkGray font-rubik w-full box-shadow-small2 text-center py-[8px] flex items-center justify-center gap-[8px]'>
            <FontAwesomeIcon icon={faAnglesDown} className='size-[16px]'/>
            <div>Manage Events</div>
            <FontAwesomeIcon icon={faAnglesDown} className='size-[16px]'/>
        </div>

        <EventsContainer mode="checkin" adminMode={true}/>
        <EventsContainer mode="pastTournaments" adminMode={true}/>
    </div>
  )
}
export default page