import React, {useState} from 'react';
import { View} from 'react-native';
import { Horizontal_Navbar } from '../../components/LibaryPage/mainNav';
import { actionListType, ExploreView } from '../../components/AddPage/exploreView';
import { styles } from "../../styles/add_style";
import { actionNavigationTypes, ExplainModal } from "../../components/AddPage/explainModal";

const AddDetection = ({navigation}) => {

//<==================<[ Variable ]>====================>  

type selectedItemType = {title:string,action:actionNavigationTypes,icon_name:string,type:"melanoma-monitor" | "medical-ai-assistant" | "diagnosis-ai"}[]



const [headerSelect, setHeaderSelect] = useState<"ai_vision" | "blood_work" | "diagnosis" | "soon">("ai_vision")
const [selected, setSelected ] = useState<selectedItemType>([]) // IF It's empty array modal wont show

//<==================<[ Main Return ]>====================> 

    return(
        <View style={styles.container}>
                    <ExploreView 
                        navigation={navigation}
                        setSelected={setSelected}
                    />

                    <ExplainModal 
                        selected={selected}
                        setSelected={setSelected}
                        navigation={navigation}
                    /> 
        </View>
    )}

export default AddDetection;








