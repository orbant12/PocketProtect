import { View,Text,Image,TouchableOpacity,ScrollView } from "react-native"
import { NavBar_OneOption } from "../Common/navBars"
import { AssistTab } from "../LibaryPage/Melanoma/SingleMole/tabs/assistTab"

export const AssistantSelectorScreen = ({
    setProgress,
    navigation,
    selectedMoles
}) => {


    return(
        <>
            <NavBar_OneOption 
                icon_left={{name:"arrow-left",size:30,action:() => setProgress(0)}}
                title={"Select Assistant"}
            />
            <ScrollView style={{width:"100%"}} contentContainerStyle={{alignItems:"center"}}>
                <AssistTab 
                    bodyPart={selectedMoles}
                    navigation={navigation}
                />
            </ScrollView>

        </>
    )
}