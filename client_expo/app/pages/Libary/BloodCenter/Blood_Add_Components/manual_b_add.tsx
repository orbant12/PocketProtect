import { Keyboard, Pressable, Text, TouchableOpacity, View } from "react-native";
import { add_styles } from "../../../../styles/blood_styles";
import { BloodWorkComponent } from "./bloodWorkComponent";
import { useState } from "react";


export const ManualBloodAddPage = ({
    progress,
    handleUpload,
    setProgress,
    handleBloodWorkDataChange,
    bloodWorkData,
    initialProgress,
    setInitialProgress
}) => {

    const [ focused,setFocused] = useState(false)

    const manual = [
        {
            q:"Basic Health Indicators",
            component: <BloodWorkComponent 
                indexPass={0}
                setFocused={setFocused}
                handleBloodWorkDataChange={(title,type,e) => handleBloodWorkDataChange(title,type,e)}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Lipid Panel",
            component:<BloodWorkComponent 
                indexPass={1}
                setFocused={setFocused}
                handleBloodWorkDataChange={(title,type,e) => handleBloodWorkDataChange(title,type,e)}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Metabolic Panel",
            component:<BloodWorkComponent 
                indexPass={2}
                setFocused={setFocused}
                handleBloodWorkDataChange={(title,type,e) => handleBloodWorkDataChange(title,type,e)}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Liver Function Tests",
            component:<BloodWorkComponent 
                indexPass={3}
                setFocused={setFocused}
                handleBloodWorkDataChange={(title,type,e) => handleBloodWorkDataChange(title,type,e)}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Thyroid Panel",
            component:<BloodWorkComponent 
                indexPass={4}
                setFocused={setFocused}
                handleBloodWorkDataChange={(title,type,e) => handleBloodWorkDataChange(title,type,e)}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Iron Studies",
            component:<BloodWorkComponent 
                indexPass={5}
                setFocused={setFocused}
                handleBloodWorkDataChange={(title,type,e) => handleBloodWorkDataChange(title,type,e)}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Vitamins and Minerals",
            component:<BloodWorkComponent 
                indexPass={6}
                setFocused={setFocused}
                handleBloodWorkDataChange={(title,type,e) => handleBloodWorkDataChange(title,type,e)}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Inflammatory Markers",
            component:<BloodWorkComponent 
                indexPass={7}
                setFocused={setFocused}
                handleBloodWorkDataChange={(title,type,e) => handleBloodWorkDataChange(title,type,e)}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Hormonal Panel",
            component:<BloodWorkComponent 
                indexPass={8}
                setFocused={setFocused}
                handleBloodWorkDataChange={(title,type,e) => handleBloodWorkDataChange(title,type,e)}
                bloodWorkData={bloodWorkData}
            />
        }
    ]

    return(
        <>
        {
        focused ?
            <Pressable onPress={() => Keyboard.dismiss()} style={{width:"100%",height:"90%",alignItems:"center",justifyContent:"space-between",borderWidth:0,marginBottom:"20%"}}>
                <View style={{width:"90%",alignItems:"center",backgroundColor:"#eee",justifyContent:"center",padding:20,borderRadius:10,marginTop:10}}>
                    <Text style={{fontWeight:"700",fontSize:20,width:"100%",textAlign:"center"}}>{manual[initialProgress].q}</Text>            
                </View> 
            {manual[initialProgress].component}
                <TouchableOpacity onPress={() => {setProgress(progress + 0.1),setInitialProgress(initialProgress + 1)}} style={[add_styles.startButton,{marginBottom:10}]}>                        
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                </TouchableOpacity> 
            </Pressable>
            :
            <View style={{width:"100%",height:"90%",alignItems:"center",justifyContent:"space-between",borderWidth:0,marginBottom:"20%"}}>
                <View style={{width:"90%",alignItems:"center",backgroundColor:"#eee",justifyContent:"center",padding:20,borderRadius:10,marginTop:10}}>
                    <Text style={{fontWeight:"700",fontSize:20,width:"100%",textAlign:"center"}}>{manual[initialProgress].q}</Text>            
                </View> 
            {manual[initialProgress].component}
                <TouchableOpacity onPress={() => {setProgress(progress + 0.1),setInitialProgress(initialProgress + 1)}} style={[add_styles.startButton,{marginBottom:10}]}>                        
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                </TouchableOpacity>
            
            </View>
        }
        </>
    )
}