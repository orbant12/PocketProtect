
import { View, Text,TouchableOpacity,StyleSheet,TouchableHighlight} from 'react-native';

import React, { useEffect, useState } from 'react';
import { useAuth } from "../../../context/UserAuthContext";
import { fetchAllDiagnosis } from "../../../services/server"
import { DiagnosisBox_Pressable } from '../../../components/ProfilePage/diagnosisPanel/diagnosisBox';


const UserDiagnosis = ({navigation}) => {

    const { currentuser } = useAuth();

    const [ diagnosisData, setDiagnosisData] = useState([])

    const fetchDiagnosis = async () => {
        const response = await fetchAllDiagnosis({
            userId: currentuser.uid,
        })
        if(response != false && response != "NoDiagnosis"){
            setDiagnosisData(response)
        } else if (response == false){
            alert("Something went wrong !")
        } else if ( response == "NoDiagnosis") {
            setDiagnosisData([])
        }
    }

    useEffect(()=> {
        fetchDiagnosis()
    }, [])

    const handleOpenFromProgress = (data) => {
            navigation.navigate("SurveyScreen", {data: data.stages.stage_two == null ? data.stages.stage_one : data.stages.stage_two , clientSymphtoms:data.clientSymphtoms, outcomes:data.possibleOutcomes, isDone: data.diagnosis})
    }

    return (
        <View style={styles.container}>
            {diagnosisData.map((data) => (
                <DiagnosisBox_Pressable 
                    data={data}
                    handleOpenFromProgress={handleOpenFromProgress}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:"100%",
        height:"100%",
        alignItems:"center"
    }
})

export default UserDiagnosis;
