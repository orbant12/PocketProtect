import { Pressable } from "react-native";
import { Text, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function SkinTypeScreen({
    setProgress,
    progress,
    handleMelanomaDataChange,
    melanomaMetaData,
    styles
}){
    return(          
        <View style={[styles.startScreen,{height:"85%",marginTop:"5%",justifyContent:"space-between"}]}>                                    
                <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%"}}>  
                    <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>What is your skin type ?</Text>
                    
                    <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <MaterialCommunityIcons 
                            name="information"
                            color={"black"}
                            size={30}
                            style={{width:"10%",opacity:0.6}}
                        />
                        <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>Different skin type are more volnurable to UV exposere</Text>
                    </View>
                    
                </View>
                <View style={{marginTop:0}}>
                    <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:30}}>
                            <Pressable onPress={() => handleMelanomaDataChange("skin_type",0)} style={[{ backgroundColor:"#fde3ce"}, melanomaMetaData.skin_type == 0 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                
                            <Pressable onPress={() => handleMelanomaDataChange("skin_type",1)} style={[{ backgroundColor:"#fbc79d"},melanomaMetaData.skin_type  == 1 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                    
                    </View>

                    <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginBottom:0}}>
                        <Pressable onPress={() => handleMelanomaDataChange("skin_type",2)} style={[{ backgroundColor:"#934506"},melanomaMetaData.skin_type  == 2 ? styles.skinTypeOptionButtonA: styles.skinTypeOptionButton]} />                            
                        <Pressable onPress={() => handleMelanomaDataChange("skin_type",3)} style={[{ backgroundColor:"#311702"},melanomaMetaData.skin_type == 3 ? styles.skinTypeOptionButtonA : styles.skinTypeOptionButton]} />                                        
                    </View>
                </View>
                <View style={{width:"100%",alignItems:"center",marginBottom:0}}>
                {melanomaMetaData.skin_type != null ? 
                    <Pressable onPress={() => setProgress(progress + 0.1)} style={[styles.startButton,{position:"relative",marginBottom:0,marginTop:0}]}>
                        <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                    </Pressable>
                    :
                    <Pressable style={[styles.startButtonNA,{marginTop:0}]}>
                        <Text style={{padding:15,fontWeight:"600"}}>Not Selected Yet</Text>
                    </Pressable>
                }        
                </View>

            </View>                
        
        
    )
}
