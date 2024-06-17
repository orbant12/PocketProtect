import { View,Text,TouchableOpacity } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { Mstyles, spotUploadStyle } from "../../../styles/libary_style"
import { styles_shadow } from "../../../styles/shadow_styles"
import { HeaderContainer } from "../../Common/headerContainer"

export const NavBar_Main  = ({
    navigation,
    scrollRef,
    setSkinModal,
    skinModal,
    melanomaMetaData
}) => {
    return(
        HeaderContainer({
            outerBg:"transparent",
            content:() =>
            <View style={Mstyles.ProgressBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                <MaterialCommunityIcons 
                    name="arrow-left"
                    size={25}
                    color={"white"}
                    style={{padding:5}}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>  navigation.navigate("FullMelanomaProcess",{sessionMemory:[]})} style={[{width:"60%",height:50,borderWidth:2,justifyContent:"center",borderRadius:10,marginTop:0,marginBottom:0,flexDirection:"column",alignItems:"center",backgroundColor:"black",borderColor:"magenta",padding:10},styles_shadow.shadowContainer]}>
                    <Text style={{color:"white",opacity:0.7,fontWeight:"500",fontSize:10}}>Click to start</Text>
                    <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>                     
                    <Text style={{fontSize:14,fontWeight:"600",marginRight:10,color:"white"}}>Full Body Monitor Setup</Text>                        
                        <MaterialCommunityIcons 
                            name="liquid-spot"
                            size={15}
                            color={"white"}
                        />   
                    </View>                        
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => scrollRef.current.scrollTo({x:0,y:720,animated:true})} style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                <MaterialCommunityIcons 
                    name="monitor-eye"
                    size={20}
                    color={"white"}
                    style={{padding:9}}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSkinModal(!skinModal)} style={{backgroundColor:melanomaMetaData.skin_type == 0 ? "#fde3ce" : melanomaMetaData.skin_type == 1 ? "#fbc79d" : melanomaMetaData.skin_type == 2 ? "#934506" : melanomaMetaData.skin_type == 3 ? "#311702":null,borderRadius:"100%",padding:15,borderWidth:2,position:"absolute",right:14,top:70}} />
            
            
            </View>  
        }) 
    )
}

export const NavBar_Slug = ({
    navigation,
    handleComplete,
    handleAddMelanoma,
    completedParts,
    bodyPart
}) => {
    return( 
        HeaderContainer({
            outerBg:"white",
            content:() =>
            <View style={Mstyles.ProgressBar}>
                <TouchableOpacity onPress={() => navigation.goBack({refresh:true})}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                    <MaterialCommunityIcons 
                        name="arrow-left"
                        size={25}
                        color={"white"}
                        style={{padding:5}}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>  handleAddMelanoma()} style={[{width:"60%",height:50,borderWidth:2,justifyContent:"center",borderRadius:10,marginTop:0,marginBottom:0,flexDirection:"column",alignItems:"center",backgroundColor:"black",borderColor:"magenta",padding:10},styles_shadow.shadowContainer]}>
                        <Text style={{color:"white",opacity:0.7,fontWeight:"500",fontSize:10}}>Click to add</Text>
                        <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>  
                        <MaterialCommunityIcons 
                                name="plus"
                                size={15}
                                color={"white"}
                            />                      
                        <Text style={{fontSize:14,fontWeight:"600",marginLeft:10,color:"white"}}>Register new mole</Text>                                       
                        </View>                        
                </TouchableOpacity>
                {!completedParts.includes(bodyPart.slug)? 
                <TouchableOpacity onPress={() => handleComplete(false)} style={{backgroundColor:"red",borderRadius:30,borderColor:"white",borderWidth:2}}>
                    <MaterialCommunityIcons 
                        name="sticker-plus"
                        size={20}
                        color={"white"}
                        style={{padding:9}}
                    />
                </TouchableOpacity>  
                :
                <TouchableOpacity onPress={() => handleComplete(true)} style={{backgroundColor:"lightgreen",borderRadius:30,borderColor:"white",borderWidth:2}}>
                <MaterialCommunityIcons 
                    name="sticker-check"
                    size={20}
                    color={"white"}
                    style={{padding:9}}
                />
                </TouchableOpacity>  
            }               
            </View>
        })   
    )
}

export const NavBar_SpotAdd = ({
    navigation, 
}) => {
    return( 
    HeaderContainer({
        outerBg:"transparent",
        content:() =>
        <View style={[Mstyles.ProgressBar,{marginTop:-5}]}>
        <TouchableOpacity onPress={() => navigation.goBack({refresh:true})}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
            <MaterialCommunityIcons 
                name="arrow-left"
                size={25}
                color={"white"}
                style={{padding:5}}
            />
        </TouchableOpacity>
        <TouchableOpacity  style={{width:"50%",height:40,borderWidth:2,justifyContent:"center",borderRadius:10,marginTop:0,marginBottom:0,flexDirection:"column",alignItems:"center",backgroundColor:"black",borderColor:"magenta",padding:10,opacity:0.9}}>
                <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>                      
                    <Text style={{fontSize:14,fontWeight:"700",marginLeft:10,color:"white"}}>Spot Update</Text>                       
                </View>                        
        </TouchableOpacity>   
        <TouchableOpacity onPress={() => navigation.goBack({refresh:true})}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
            <MaterialCommunityIcons 
                name="information"
                size={25}
                color={"white"}
                style={{padding:5}}
            />
        </TouchableOpacity>         
        </View>   
    })    
    )
}

export const NavBar_Upload_1 = ({navigation}) => {
    return(
        <View style={spotUploadStyle.ProgressBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
            <MaterialCommunityIcons 
                name="arrow-left"
                size={25}
                color={"white"}
                style={{padding:5}}
            />
        </TouchableOpacity> 
        <View style={{width:"85%",backgroundColor:"rgba(0,0,0,0.05)",alignItems:"center",justifyContent:"center",marginBottom:0,padding:10,borderRadius:10}}>
                <Text style={{fontWeight:"700",fontSize:18}}>Press the body part to monitor</Text>    
            </View>                                
        </View> 
    )
}