
import { View, Text,TouchableOpacity,StyleSheet,TouchableHighlight} from 'react-native';

import React, { useEffect, useState } from 'react';
import { useAuth } from "../../../context/UserAuthContext";
import { fetchAllDiagnosis } from "../../../server"


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
            navigation.navigate("SurveyScreen", {data: data.surveyProgress , clientSymphtoms:data.clientSymphtoms, outcomes:data.possibleOutcomes, isDone: data.diagnosis})
    }

    return (
        <View style={styles.container}>
            {diagnosisData.map((data) => (
                <TouchableOpacity onPress={() => handleOpenFromProgress(data)} style={styles.diagnosisBox}>
                    <View>
                        <Text style={{fontWeight:"700",fontSize:17,color:"white"}}>{data.id}</Text>
                        <Text style={{fontWeight:"600",fontSize:13,marginTop:20,color:"white"}}>Diagnosis: <Text style={{opacity:0.5}}>{data.diagnosis}</Text></Text>
                        <Text style={{fontWeight:"600",fontSize:13,marginTop:10,maxWidth:"90%",color:"white"}}>Reported symphtoms: <Text style={{opacity:0.5}}>{data.clientSymphtoms}</Text></Text>
                    </View>
                    <Text style={{fontWeight:"600",fontSize:10,color:"white",opacity:0.8}}>{data.created_at}</Text>       
                </TouchableOpacity>
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
    },
    diagnosisBox:{
        padding:15,
        borderWidth:3,
        borderColor:"#ff9ceb",
        backgroundColor:"black",    
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        width:"90%",
        borderRadius:10,
        marginTop:30
    }
})

export default UserDiagnosis;
