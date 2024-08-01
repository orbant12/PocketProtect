import { View } from "react-native"
import React,{ useEffect, useState } from "react";
import { fetchAllMelanomaSpotData } from "../../services/server";
import { useAuth } from "../../context/UserAuthContext";
import { MoleSelectorScreen } from "./moleSelector";
import { AssistantSelectorScreen } from "./assistantSelector";
import { SpotData } from "../../utils/types";

export const ManualAdd_Moles = ({
    closeAction,
    navigation
}) => {    
    const [ selectedMoles, setSelectedMoles ] = useState([])
    const [melanomaData, setMelanomaData] = useState([])
    const [riskyMelanomaData, setRiskyMelanomaData] = useState([])
    const [unfinishedMelanomaData, setUnfinishedMelanomaData] = useState([])
    const [ progress, setProgress] = useState(0)
    const { currentuser } = useAuth()

    const handleSelect  = (id) => {
        if ( selectedMoles.includes(id) ){
            setSelectedMoles(selectedMoles.filter(moleId => moleId !== id));
        } else {
            setSelectedMoles([...selectedMoles,id])
        }
        
    }

    const fetchAllMelanomaData = async () => {
        if (currentuser) {
            try {
                const response = await fetchAllMelanomaSpotData({
                    userId: currentuser.uid,
                    gender: currentuser.gender,
                });
                if(response != false){
                    response.forEach((data:SpotData) => {
                        if (data.risk >= 0.5) {
                            setRiskyMelanomaData(prevState => [...prevState, data]);
                        } else if (data.risk < 0.5 && data.risk !== null) {
                            setMelanomaData(prevState => [...prevState, data]);
                        } else if (data.risk === null) {
                            setUnfinishedMelanomaData(prevState => [...prevState, data]);
                        }
                    });
                } 
            } catch (error) {
                console.error("Error fetching melanoma data:", error);
            }
        }
    };
    
    useEffect(() => {
        fetchAllMelanomaData()
    },[])

    return(
        <View style={{width:"100%",height:"100%",alignItems:"center"}}>
            {progress == 0 &&
                <MoleSelectorScreen 
                    navigation={navigation}
                    handleSelect={handleSelect}
                    selectedMoles={selectedMoles}
                    riskyMelanomaData={riskyMelanomaData}
                    unfinishedMelanomaData={unfinishedMelanomaData}
                    melanomaData={melanomaData}
                    closeAction={closeAction}
                    setProgress={setProgress}
                    userData={currentuser}
                    allMelanomaData={[...melanomaData,...unfinishedMelanomaData,...riskyMelanomaData]}
                />
            }
            {progress == 1 &&
                <AssistantSelectorScreen 
                    setProgress={setProgress}
                    navigation={navigation}
                    selectedMoles={selectedMoles}
                />
            }
        </View>
    )
}






