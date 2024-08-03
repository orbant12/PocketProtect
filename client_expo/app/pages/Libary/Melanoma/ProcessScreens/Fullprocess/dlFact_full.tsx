import { Text } from "react-native";
import { FactScreenType_1 } from "../../../../../components/Common/FactScreenComponents/factScreenType1";


export function FactScreen({alertTeam,setProgress,progress}){
    return(
        <FactScreenType_1 
            title={"Deep Learning Neural Network"}
            descriptionRows={
                [
                    {desc:() => <Text style={{fontWeight:"600",fontSize:12,maxWidth:"90%",opacity:0.9,marginTop:0,textAlign:"justify",color:"white",backgroundColor:"rgba(255,255,255,0.05)",padding:10,borderRadius:10}}>Our AI model can detect malignant moles with a <Text style={{color:"magenta",fontWeight:"600"}}>95%</Text> accuracy which is <Text style={{color:"magenta",fontWeight:"600"}}>+20% </Text>better then the accuracy of dermotologists </Text>},
                    {desc:() => <Text style={{fontWeight:"600",fontSize:12,maxWidth:"90%",opacity:0.9,marginTop:10,textAlign:"justify",color:"white",backgroundColor:"rgba(255,255,255,0.05)",padding:10,borderRadius:10}}>Your moles can be supervised by both <Text style={{color:"magenta",fontWeight:"800"}}>AI & Dermotologist</Text> to be as protected as possible and alert you to consult a possible removal with your dermotologist</Text>},
                ]
            }
            imageSource={alertTeam}
            buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.1}}}
            setProgress={setProgress}
            imageStyle={{borderRadius:10,borderWidth:2,borderColor:"lightgray"}}
        />
    )
}