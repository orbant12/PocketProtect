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
                index={0}
                setFocused={setFocused}
                handleBloodWorkDataChange={handleBloodWorkDataChange}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Lipid Panel",
            component:<BloodWorkComponent 
                index={1}
                setFocused={setFocused}
                handleBloodWorkDataChange={handleBloodWorkDataChange}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Metabolic Panel",
            component:<BloodWorkComponent 
                index={2}
                setFocused={setFocused}
                handleBloodWorkDataChange={handleBloodWorkDataChange}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Liver Function Tests",
            component:<BloodWorkComponent 
                index={3}
                setFocused={setFocused}
                handleBloodWorkDataChange={handleBloodWorkDataChange}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Thyroid Panel",
            component:<BloodWorkComponent 
                index={4}
                setFocused={setFocused}
                handleBloodWorkDataChange={handleBloodWorkDataChange}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Iron Studies",
            component:<BloodWorkComponent 
                index={5}
                setFocused={setFocused}
                handleBloodWorkDataChange={handleBloodWorkDataChange}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Vitamins and Minerals",
            component:<BloodWorkComponent 
                index={6}
                setFocused={setFocused}
                handleBloodWorkDataChange={handleBloodWorkDataChange}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Inflammatory Markers",
            component:<BloodWorkComponent 
                index={7}
                setFocused={setFocused}
                handleBloodWorkDataChange={handleBloodWorkDataChange}
                bloodWorkData={bloodWorkData}
            />
        },
        {
            q:"Hormonal Panel",
            component:<BloodWorkComponent 
                index={8}
                setFocused={setFocused}
                handleBloodWorkDataChange={handleBloodWorkDataChange}
                bloodWorkData={bloodWorkData}
            />
        }
    ]

    return(
        <>
        {
        (focused) ?
            <Pressable onPress={() => Keyboard.dismiss()} style={{width:"100%",height:"90%",alignItems:"center",justifyContent:"space-between",borderWidth:0,marginBottom:"20%"}}>
                <View style={{width:"90%",alignItems:"center",backgroundColor:"#eee",justifyContent:"center",padding:20,borderRadius:10,marginTop:10}}>
                    <Text style={{fontWeight:"700",fontSize:20,width:"100%",textAlign:"center"}}>{manual[initialProgress].q}</Text>            
                </View> 
            {manual[initialProgress].component}
            {initialProgress == 8 ?
                <TouchableOpacity onPress={() => {/*handleUpload(methodSelected)*/{handleUpload()}}} style={[add_styles.startButton,{marginBottom:10}]}>                        
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Upload</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => {setProgress(progress + 0.1),setInitialProgress(initialProgress + 1),handleUpload()}} style={[add_styles.startButton,{marginBottom:10}]}>                        
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Upload & Next</Text>
                </TouchableOpacity>
            } 
            </Pressable>
            :
            <View style={{width:"100%",height:"90%",alignItems:"center",justifyContent:"space-between",borderWidth:0,marginBottom:"20%"}}>
                <View style={{width:"90%",alignItems:"center",backgroundColor:"#eee",justifyContent:"center",padding:20,borderRadius:10,marginTop:10}}>
                    <Text style={{fontWeight:"700",fontSize:20,width:"100%",textAlign:"center"}}>{manual[initialProgress].q}</Text>            
                </View> 
            {manual[initialProgress].component}
            {initialProgress == 8 ?
                <TouchableOpacity onPress={() => {/*handleUpload(methodSelected)*/{handleUpload()}}} style={[add_styles.startButton,{marginBottom:10}]}>                        
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Upload</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => {setProgress(progress + 0.1),setInitialProgress(initialProgress + 1),handleUpload()}} style={[add_styles.startButton,{marginBottom:10}]}>                        
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Upload & Next</Text>
                </TouchableOpacity>
            } 
            </View>
        }
        </>
    )
}