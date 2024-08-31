import { useState } from "react"
import TabButton from "~/app/_components/TabButton"
import GroupComponent from "~/app/_components/GroupComponent"
import AddPartcipantForm from "./AddPartcipantForm"
import GroupSettingsTab from "./GroupSettingsTab"

function AddParticipantsTab() {
    return (
        <>  
            <GroupComponent header="Participants" />
            <AddPartcipantForm/>
        </>
    ) 
}


function SettingsTab() {

    const [tab, setTab] = useState<'Add Participants' | 'Group Settings'>('Add Participants')

    const renderTabContent = () => {
        switch (tab) {
            case 'Add Participants':
                return <AddParticipantsTab />
            case 'Group Settings':
                return <GroupSettingsTab />
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