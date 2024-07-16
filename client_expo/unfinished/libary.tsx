import { MainBloodBox } from "../app/components/LibaryPage/mainBoxes"
import { View, Text,TouchableOpacity } from "react-native"
import { styles } from "../app/styles/libary_style"
import { MainDiagnosisBox } from "../app/components/LibaryPage/mainBoxes"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRef } from "react"

const bloodAnalysisRef = useRef(null);

const Blood_Category = ({
    navigation,
    handleScrollReminder,
    currentPage,
    bloodAnalysisRef
}:{
    navigation:any;
    handleScrollReminder:({nativeEvent}:{nativeEvent: {position:number}}) => void;
    currentPage:number;
    bloodAnalysisRef:any;
}) => {
    return(
        <>
    {/*Blood Analasis*/}
    <View ref={bloodAnalysisRef} style={{width:"100%"}}>
        <Text style={{fontWeight:"800",fontSize:24,margin:15,marginTop:40}}>Blood Analasis</Text>
        <MainBloodBox
            navigation={navigation}
            handleScrollReminder={handleScrollReminder}
            currentPage={currentPage}
        />
    </View>
    </>
    )
}
const diagnosisRef = useRef(null);

const Diagnosis_Category = ({
    navigation,
    diagnosisData,
    diagnosisRef
}:{
    navigation:any;
    diagnosisData:any;
    diagnosisRef:any;
}) => {
    return(
        <>
            {/*DIAGNOSIS*/}
            <View ref={diagnosisRef}  style={{width:"100%"}}>
            <Text style={{fontWeight:"800",fontSize:24,margin:15,marginTop:40}}>Custom Diagnosis</Text>
            {diagnosisData.map((data,index) => (
                <MainDiagnosisBox 
                    navigation={navigation}
                    data={data}
                    key={index}
                />
            ))}
            <View style={styles.selectBox}>
                <View style={styles.boxTop}>
                    <View style={{flexDirection:"row"}}>
                        <MaterialCommunityIcons 
                            name='doctor'
                            size={30}
                        />
                        <View style={{marginLeft:20}}>
                            <Text style={{fontWeight:"800",fontSize:16}}>Start a diagnosis process</Text>
                            <Text style={{fontWeight:"400",fontSize:10,maxWidth:"85%",opacity:0.5}}>Detailed Analasis with advice and hands on practices </Text>
                        </View>
                    </View>    
                    <MaterialCommunityIcons 
                        name='bell'
                        size={20}
                    />
                </View>
                <View style={styles.boxBottom}>
                    <View style={{padding:1,width:"55%",marginRight:10,opacity:0.6, borderLeftWidth:0.3,paddingLeft:10,borderColor:"magenta"}}>
                        <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Eliminating deficiencies</Text>
                        <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Outline </Text>
                        <Text style={{color:"black",fontSize:12,fontWeight:"300"}}>Outdated Moles: {"0"}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("add-detection")} style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                        <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:15}}>Open</Text>
                        <MaterialCommunityIcons 
                            name='arrow-right'
                            size={15}
                            color={"magenta"}                                                                        
                        />
                    </TouchableOpacity>                            
                </View>      
            </View>                        
            </View>
         </>
    )
}