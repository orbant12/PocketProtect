import { View, Text, ScrollView,Image,TouchableOpacity } from "react-native"
import melanomaBG from "../../assets/features/melanoma.png"
import bloodBG from "../../assets/features/blood.png"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ExpStyle } from "../../styles/add_style";
import { TagContainer } from "../Common/tagContainer";
import { styles_shadow } from "../../styles/shadow_styles";
import diagnsisBG from "../../assets/features/diagn.png"

export type addTypes = "Melanoma Monitor" | "Medical AI Assistant" | "Diagnosis AI"

export const ExploreView = ({navigation,setSelected}) => {

    // const handleNavigation = (path) => {
    //     if ( path == "Melanoma Monitor"){
    //         Navigation_MoleUpload({
    //             navigation: navigation
    //         })
    //     }
    // }
    
    return(
        <ScrollView style={{width:"100%",height:"100%",backgroundColor:"white"}}>
        <View style={ExpStyle.container}>
                <Text style={{fontWeight:"800",fontSize:24,margin:15,alignSelf:"flex-start"}}>Skin Cancer</Text>
                <View style={ExpStyle.section}>
                    <FeatureBox 
                        icon={{name:"liquid-spot",size:30}}
                        backgroundImage={melanomaBG}
                        title={"Melanoma Monitor"}
                        labels={[
                            {
                                text:"Real Dermotologis",
                                icon_name:"doctor"
                            },
                            {
                                text:"Deep Neural Network",
                                icon_name:"brain"
                            },
                            {
                                text:"Personal Reminder",
                                icon_name:"calendar"
                            },
                            {
                                text:"Personalised Advice",
                                icon_name:"magnify"
                            },
                        ]}
                        setSelected={setSelected}
                    />
                </View>
                <Text style={{fontWeight:"800",fontSize:24,margin:15,alignSelf:"flex-start"}}>AI Features</Text>
                <View style={ExpStyle.section}>
                    <FeatureBox 
                        icon={{name:"doctor",size:30}}
                        backgroundImage={bloodBG}
                        title={"Medical AI Assistant"}
                        labels={[
                            {
                                text:"Real Dermotologis",
                                icon_name:"doctor"
                            },
                            {
                                text:"Deep Neural Network",
                                icon_name:"brain"
                            },
                            {
                                text:"Personal Reminder",
                                icon_name:"calendar"
                            },
                            {
                                text:"Personalised Advice",
                                icon_name:"magnify"
                            },
                        ]}
                        setSelected={setSelected}
                    />
                    <FeatureBox 
                        icon={{name:"stethoscope",size:30}}
                        backgroundImage={diagnsisBG}
                        title={"Diagnosis AI"}
                        labels={[
                            {
                                text:"Real Dermotologis",
                                icon_name:"doctor"
                            },
                            {
                                text:"Deep Neural Network",
                                icon_name:"brain"
                            },
                            {
                                text:"Personal Reminder",
                                icon_name:"calendar"
                            },
                            {
                                text:"Personalised Advice",
                                icon_name:"magnify"
                            },
                        ]}
                        setSelected={setSelected}
                    />
                </View>
        
        </View>
        
        </ScrollView>
        
    )
}

export type actionListType = {
    melanoma:{title:string,action:string,icon_name:string,type:"melanoma-monitor" | "medical-ai-assistant" | "diagnosis-ai"}[]
    blood_work:{title:string,action:string,icon_name:string,type:"melanoma-monitor" | "medical-ai-assistant" | "diagnosis-ai"}[]
    diagnosis:{title:string,action:string,icon_name:string,type:"melanoma-monitor" | "medical-ai-assistant" | "diagnosis-ai"}[]
}

const FeatureBox = ({
    icon,
    backgroundImage,
    title,
    labels,
    setSelected
}) => {
    const actionList:actionListType = {
        melanoma:[ 
            {title:"Full Body Setup", action:"Full_Melanoma_Navigation", icon_name:"clipboard-account-outline",type:"melanoma-monitor"},
            {title:"Manual Body Setup", action:"Manual_Melanoma_Navigation", icon_name:"plus",type:"melanoma-monitor"}
        ],
        blood_work:[
            {title:"Start Chat", action:"Ai_Chat_Navigation", icon_name:"clipboard-account-outline",type:"medical-ai-assistant"},
        ],
        diagnosis:[
            {title:"Start Diagnosis", action:"Ai_Diagnosis_Navigation", icon_name:"clipboard-account-outline", type:"diagnosis-ai"},
        ]
        
    }
    const modalDataLogic = (title:addTypes) => {
        if ( title == "Melanoma Monitor") {
            setSelected(actionList.melanoma)
        } else if ( title == "Medical AI Assistant") {
            setSelected(actionList.blood_work)
        } else if ( title == "Diagnosis AI") {
            setSelected(actionList.blood_work)
        }
    }

    return(
        <View style={[ExpStyle.featureBox,styles_shadow.hightShadowContainer]}>
            <Image 
                source={backgroundImage}
                style={{position:"absolute",width:"100%",height:"100%",zIndex:0,opacity:0.4,borderRadius:10}}
            />
            <View style={{padding:10,width:"100%",height:"100%",justifyContent:"space-between",alignItems:"center"}}>
                <View style={{width:"100%",justifyContent:"center",flexDirection:"row",alignItems:"center",marginTop:10}}>
                    <MaterialCommunityIcons 
                        name={icon.name}
                        size={icon.size}
                        color={"white"}
                    />
                    <Text style={{fontWeight:"700",fontSize:18,color:"white",marginLeft:10}}>{title}</Text>
                </View>
                <TagContainer 
                    labels={labels}
                />
                <TouchableOpacity onPress={() => modalDataLogic(title)} style={{flexDirection:"row",alignItems:"center",backgroundColor:"white",width:"100%",justifyContent:"center",padding:12,borderRadius:5,opacity:0.7}}>
                    <Text style={{fontSize:14,fontWeight:"600",marginRight:10}}>Start</Text>
                    <MaterialCommunityIcons 
                        name='arrow-right'
                        size={15}
                        color={"magenta"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}




