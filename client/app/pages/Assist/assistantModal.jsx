import { StyleSheet, View, Text,ScrollView,Image,TouchableOpacity } from "react-native";
import { NavBar_AssistantModal } from "../../components/ProfilePage/assistancePanel/navbarAssistantModal";
import { useRef } from "react";
import { Rating } from 'react-native-stock-star-rating'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const AssistModal = ({
    assistantData,
    setSelectedAssistant,
    handlePaymentProcess
}) => {

    const scrollRef = useRef(null)

    return(
        <>
        <ScrollView ref={scrollRef} style={{width:"100%",height:"100%"}}>
            <View style={styles.container}>
                <NavBar_AssistantModal 
                    scrollRef={scrollRef}
                    goBack={setSelectedAssistant}
                />
                <ProfileSection 
                    assistantData={assistantData}
                />
                <BioSection 
                    assistantData={assistantData}
                />
                
            </View>
        </ScrollView>
        <TouchableOpacity onPress={() => handlePaymentProcess(assistantData.id)} style={{width:"90%",position:"absolute",padding:20,paddingVertical:15,bottom:30,justifyContent:"center",backgroundColor:"magenta",borderRadius:10,alignItems:"center",alignSelf:"center"}}>
            <Text style={{fontWeight:"600",color:"white"}}>Start Appointment</Text>
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:100,
        alignItems:"center"
    }
}) 


const ProfileSection = ({
    assistantData
}) => {
    return(
        <View style={{alignItems:"center",width:"70%"}}>
        <Text style={{fontWeight:"700",fontSize:20}}>{assistantData.fullname}</Text>
        <Image 
            style={{width:150,height:150,borderRadius:10,marginTop:20}}
            source={{uri:assistantData.profileUrl}}
        />
        <View style={{width:"100%",alignItems:"center", flexDirection:"row",justifyContent:"space-between",marginTop:30}}>
            <DataTag 
                icon={{name:"heart"}}
                main={"150+"}
                sub={"Likes"}
            />
            <DataTag 
                icon={{name:"crown"}}
                main={"+10 years"}
                sub={"Experience"}
            />
            <DataTag 
                icon={{name:"star"}}
                main={"3.9"}
                sub={"Feedback"}
            />
        </View>
    </View>
    )
}

const DataTag = ({
    icon,
    main,
    sub
}) => {
    return(
        <View style={{alignItems:"center",justifyContent:"center"}}>
        <View style={{padding:10,borderRadius:100,backgroundColor:"rgba(0,0,0,0.1)"}}>
            <MaterialCommunityIcons 
                name={icon.name}
                size={30}
            />
        </View>
        <Text style={{marginVertical:10,fontSize:17,fontWeight:"600"}}>{main}</Text>
        <Text style={{fontWeight:"500",opacity:0.4,fontSize:13}}>{sub}</Text>
    </View>
    )
}

const BioSection = ({
    assistantData
}) => {
    return(
        <View style={{width:"100%",borderTopRightRadius:50,borderTopLeftRadius:50,backgroundColor:"rgba(0,0,0,0.01)",alignItems:"center",padding:10,marginTop:40,height:"100%"}}>
            <View style={{margin:10,alignItems:"center"}}>
                <Text style={{fontWeight:"800",fontSize:20}}>Dermotology Professional</Text>
                <Text style={{fontWeight:"700",fontSize:12,opacity:0.5}}>Graduated at: Valami</Text>
                <Rating 
                    stars={3.9}
                    maxStarts={5}
                    size={20}
                />
            </View>
            <View style={{marginTop:20}}>
                <Text style={{fontWeight:"700",marginBottom:15}}>About</Text>
                <Text style={{opacity:0.6}}>A msés kdmksm dkélmsékl dmkélsmlpkdmlksmkdlms klmdlk mskdmlks mdklms klmdksksm dkélmsékl dmkélsmlpkdmlksmkdlms klmdlk mskdmlks mdklms klmdlk smlkdm slkdmkls mdlksm kldmskl mdklsm dklsmlkdmdsljfgnkjsd  m dkélmsékl dmkélsmlpkdmlksmkdlms klmdlk mskdmlks mdklms klmdlk smlkdm slkdmkls mdlksm kldmskl mdklsm dklsmlkdmdsljfgnkjsd  lk smlkdm slkdmkls mdlksm kldmskl mdklsm dklsmlkdmdsljfgnkjsd nfjkndfljkfndfskjnfkjfdnfkjldnfjlk</Text>
            </View>
            <View style={{marginTop:30}}>
                <Text style={{fontWeight:"700",marginBottom:15}}>Client Feedback</Text>
                
            </View>
        </View>

    )
}
