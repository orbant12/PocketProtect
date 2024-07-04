import React, {useState} from 'react';
import { View} from 'react-native';
import { Horizontal_Navbar } from '../../components/LibaryPage/mainNav';
import { ExploreView } from '../../components/AddPage/exploreView';
import { styles } from "../../styles/add_style";
import { ExplainModal } from "../../components/AddPage/explainModal";

const AddDetection = ({navigation}) => {

//<==================<[ Variable ]>====================>  


const [headerSelect, setHeaderSelect] = useState<"ai_vision" | "blood_work" | "diagnosis" | "soon">("ai_vision")
const [selected, setSelected ] = useState([]) // IF It's empty array modal wont show

//<==================<[ Main Return ]>====================> 

    return(
        <View style={styles.container}>
                    <Horizontal_Navbar
                        setIsSelected={setHeaderSelect}
                        isSelected={headerSelect}
                        options={[
                            {
                                title:"AI Vision",
                                value:"ai_vision",
                            }
                        ]}
                    />       
                    <ExploreView 
                        navigation={navigation}
                        setSelected={setSelected}
                    />

                    <ExplainModal 
                        selected={selected}
                        setSelected={setSelected}
                    /> 
        </View>
    )}

export default AddDetection;








