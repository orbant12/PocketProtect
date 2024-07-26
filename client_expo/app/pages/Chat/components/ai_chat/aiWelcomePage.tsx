import { Image, Modal, Text, TouchableOpacity,View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { UserData } from "../../../../utils/types";
import { styles } from '../../../../styles/chatBot_style';
import { styles_shadow } from "../../../../styles/shadow_styles";

export const AiAssistant = ({
    setSelectedType ,
     handleStartChat,
    userData
}:{
  setSelectedType:(e:null | "context" | "help") => void;
   handleStartChat:(arg:string) => void;
  userData:UserData
}) => {
  return(
      <View style={{width:"100%",height:"100%"}}>
        <View style={[styles.container,{height:"90%",justifyContent:"space-between",backgroundColor:"white",alignSelf:"baseline",paddingBottom:20}]}>    
          <WelcomeAiCompontent 
            setSelectedType={setSelectedType}
            userData={userData}
          />
          <WelcomeBottom 
            handleStartChat={handleStartChat}
          />
        </View>
      </View>
  )
}

const WelcomeAiCompontent = ({setSelectedType,userData}:{setSelectedType:(arg: "questions" | "context" | "help" | null) => void; userData:UserData}) => {
  return(
    <View  style={[{width:"100%",flexDirection:"column",alignItems:"center",height:"60%",justifyContent:"center"},styles_shadow.shadowContainer]}>
      <View>
        <Text style={{fontWeight:"600",opacity:1}}><Text style={{fontWeight:"600",opacity:0.5}}>Hi {userData.fullname}</Text> 👋</Text>
        <Text style={{marginTop:8,fontWeight:"800",fontSize:25}}>Your AI Medic</Text>
      </View>
      <View style={{width:"100%",alignItems:"center",marginTop:20,opacity:0.8}}>
        <TouchableOpacity onPress={() => setSelectedType("questions")} style={{width:"60%",paddingHorizontal:10,paddingVertical:15,backgroundColor:"rgba(0,0,0,0.3)",borderRadius:10,justifyContent:"center",alignItems:"center",marginVertical:10,borderWidth:2}}>
          <Text style={{color:"white",fontWeight:"700"}}>Questions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedType("context")} style={{width:"60%",paddingHorizontal:10,paddingVertical:15,backgroundColor:"rgba(0,0,0,0.7)",borderRadius:10,justifyContent:"center",alignItems:"center",marginVertical:10,borderWidth:2}}>
          <Text style={{color:"white",fontWeight:"700"}}>Context Sheet</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const WelcomeBottom = ({
   handleStartChat
}) => {
  return(
    <View style={[{alignItems:"center",width:"100%",marginBottom:20,height:230,justifyContent:"space-between",borderWidth:0,borderColor:"red"},styles_shadow.shadowContainer]}>
      <View style={{alignItems:"center",width:"100%"}}>
        
        <View style={{width:"80%",padding:15,backgroundColor:"rgba(0,0,0,0.9)",alignItems:"center",borderRadius:10}}>
          <View style={{width:"100%",padding:10,backgroundColor:"rgba(255,255,255,0.1)",borderRadius:5,marginBottom:10,flexDirection:"row",alignItems:"center"}}>
            <MaterialCommunityIcons 
              name='head-question-outline'
              size={25}
              color={"white"}
            />
            <Text style={{fontWeight:"700",opacity:0.9,fontSize:11,textAlign:"left",color:"white",width:"88%",marginLeft:"5%"}}>Get quick and accurate advice and insight to your concerns and sympthoms</Text>
          </View>
        
          <View style={{width:"100%",padding:10,backgroundColor:"rgba(255,255,255,0.1)",borderRadius:5,marginBottom:0,flexDirection:"row",alignItems:"center"}}>
            <MaterialCommunityIcons 
              name='eye'
              size={25}
              color={"white"}
            />
            <Text style={{fontWeight:"700",opacity:0.9,fontSize:11,textAlign:"left",color:"white",width:"88%",marginLeft:"5%"}}>AI can see your Medical Data like: Blood Work, BMI or additional vital medical information you've provided ...</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleStartChat("get_started")} style={{width:"80%",paddingHorizontal:20,paddingVertical:18,backgroundColor:"magenta",borderRadius:10,justifyContent:"center",alignItems:"center",marginVertical:10}}>
        <Text style={{color:"white",fontWeight:"700"}}>Get Started</Text>
      </TouchableOpacity>
    </View>
  )
}