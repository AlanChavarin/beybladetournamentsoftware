import { useState } from "react"
import TabButton from "~/app/_components/TabButton"
import GroupComponent from "~/app/_components/GroupComponent"
import AddPartcipantForm from "./AddPartcipantForm"
import GroupSettingsTab from "./GroupSettingsTab"
import { EventType, GroupType, PlayerType } from "~/server/db/schema"


function AddParticipantsTab({event, players}: {event: EventType, players: PlayerType[]}) {
    return (
        <>  
            <GroupComponent header="Participants" showDeleteButton={true} players={players} event={event}/>
            <AddPartcipantForm eventid={event.id}/>
        </>
    ) 
}


function SettingsTab({groups, event, players}: {groups: GroupType[], event: EventType, players: PlayerType[]}) {

    const [tab, setTab] = useState<'Add Participants' | 'Group Settings'>('Add Participants')

    const renderTabContent = () => {
        switch (tab) {
            case 'Add Participants':
                return <AddParticipantsTab event={event} players={players} />
            case 'Group Settings':
                return <GroupSettingsTab groups={groups} event={event} />
        }
    }

  return (
    <div className="flex flex-col items-center gap-[14px] p-[8px]">
        <div className="flex flex-row justify-center gap-[8px] text-[10px]">
            <TabButton color='gray' text="Add Participants" onClick={() => setTab('Add Participants')} activeTab={tab}/>
            <TabButton color='gray' text="Group Settings" onClick={() => setTab('Group Settings')} activeTab={tab}/>
        </div>
        {renderTabContent()}
    </div>
  )
}
export default SettingsTab