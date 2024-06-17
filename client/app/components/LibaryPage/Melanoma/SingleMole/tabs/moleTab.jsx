import { SingleSlugStyle } from "../../../../../styles/libary_style";
import { styles_shadow } from "../../../../../styles/shadow_styles";
import { formatTimestampToString , dateDistanceFromToday} from "../../../../../utils/date_manipulations";
import LoadingOverlay from "../../../../Common/Loading/processing"
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export const MoleTab = ({
    moleDataRef,
    bodyPart,
    selectedMelanoma,
    diagnosisLoading,
    setDeleteModal,
    setMoleToDelete,
    deleteModal,
    setHighlighted,
    highlight,
    setSelectedMelanoma,
    melanomaHistory,
    handleUpdateMole,
    handleCallNeuralNetwork
}) => {

    return(
        <>
        {bodyPart != null &&
            <View style={[SingleSlugStyle.container,styles_shadow.shadowContainer]}>
            {selectedMelanoma != null && bodyPart != null &&
                selectedMelanoma.risk != null ?
                    <MalignantOrBeningDisplay 
                        selectedMelanoma={selectedMelanoma}
                    />
                    :
                    <DiagnosisStarter 
                        handleCallNeuralNetwork={handleCallNeuralNetwork}
                        selectedMelanoma={selectedMelanoma}
                    />                    
            }         

                <View style={[{marginTop:50,alignItems:"center",width:"100%"}]} >
                    <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"white",fontWeight:"800",opacity:0.6}}>Mole Data</Text>
                    {selectedMelanoma != null && bodyPart != null &&
                    <>
                        <View style={[SingleSlugStyle.melanomaBox, highlight != selectedMelanoma.storage_name && {borderColor:"white"}]}>
                            
                            <Image 
                                source={{ uri:selectedMelanoma.melanomaPictureUrl}}
                                style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                            />
                            <View style={SingleSlugStyle.melanomaBoxL}>                            
                                <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{selectedMelanoma.melanomaId}</Text>
                                <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>{formatTimestampToString(selectedMelanoma.created_at)}</Text>
                            </View>
                            <TouchableOpacity onPress={() => {setDeleteModal(!deleteModal);setMoleToDelete(selectedMelanoma)}} style={{width:"30%",flexDirection:"row",alignItems:"center",borderWidth:1.5,borderColor:"red",padding:10,borderRadius:10,opacity:0.8}}>
                                <MaterialCommunityIcons 
                                    name="delete"
                                    size={20}
                                    color={"red"}
                                />
                                <Text style={{color:"red",fontWeight:"700",marginLeft:5}}>Delete</Text>                         
                            </TouchableOpacity>               
                        </View>
                        <View style={{backgroundColor:"black",padding:20,alignItems:"center",borderBottomLeftRadius:30,borderBottomRightRadius:30}}>
                        <View style={{width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginTop:30}}>
                            <Text style={{fontWeight:"700",fontSize:20,color:"white"}}>State:</Text>
                            {dateDistanceFromToday(selectedMelanoma.created_at) != 0 ? 
                                dateDistanceFromToday(selectedMelanoma.created_at) > 0 ?                           
                                <Text style={{fontSize:15,fontWeight:"500",maxWidth:"70%",color:"white",opacity:0.5}}>Your mole is up to date for <Text style={{color:"lightgreen",fontWeight:"800",opacity:0.5}}>{dateDistanceFromToday(selectedMelanoma.created_at)} days</Text></Text>                  
                            :                         
                                <Text style={{fontSize:15,maxWidth:"70%",fontWeight:"600",color:"white",opacity:0.5}}>This mole has been outdated for <Text style={{color:"red",fontWeight:"800",opacity:0.5}}>{dateDistanceFromToday(selectedMelanoma.created_at) * -1} days</Text></Text>    
                            :
                                <Text style={{fontSize:15,maxWidth:"70%",fontWeight:"600",color:"white",opacity:0.5}}>This mole is getting outdated <Text style={{color:"lightgreen",fontWeight:"800",opacity:0.5}}>Today</Text></Text>                         
                            }
                        </View>
                        <View style={{width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginTop:30}}>
                            <Text style={{fontWeight:"600",fontSize:20,color:"white"}}>Prediction:</Text>
                            <Text style={{fontWeight:"600",fontSize:16,color:"white",opacity:0.5}}>
                                {selectedMelanoma.risk < 0.5 ? "bening" : "malignant"}
                            </Text>
                            
                        </View>   
                        <View style={{width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginTop:30}}>
                            <Text style={{fontWeight:"700",fontSize:20,color:"white"}}>Body Part:</Text>
                            <Text style={{fontWeight:"600",fontSize:16,color:"white",opacity:0.5}}>{selectedMelanoma.melanomaDoc.spot[0].slug}</Text>
                        </View>   
                        <View style={{width:"100%",justifyContent:"center",alignItems:"center",marginTop:40}}>                               
                            <Image 
                                source={{uri:selectedMelanoma.melanomaPictureUrl}}
                                style={{width:300,height:300,borderRadius:20}}
                            />
                        </View>   
                        </View> 
                    </>         
                    }                                                                                     
                    <View style={[SingleSlugStyle.container,{marginTop:50}]}>
                        <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"white",fontWeight:"800",opacity:0.6}}>History</Text>    
                        <Text style={{color:"white",opacity:0.2,fontWeight:"600",marginTop:5}}>Latest to oldest</Text>                                  
                            <TouchableOpacity onPress={() => {setHighlighted(bodyPart.storage_name); setSelectedMelanoma(bodyPart); moleDataRef.current.scrollTo({ x: 0, y: 0, animated: true }); }}  style={[SingleSlugStyle.melanomaBox, highlight != bodyPart.storage_name && {borderColor:"white"}]}>
                            <Text style={[{color:"magenta",opacity:0.6, fontWeight:"700",top:-22,position:"absolute",left:0},highlight != bodyPart.storage_name && {color:"white"}]}>Latest</Text>
                            <Image 
                                source={{ uri:bodyPart.melanomaPictureUrl}}
                                style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                            />
                            <View style={SingleSlugStyle.melanomaBoxL}>                            
                                <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{formatTimestampToString(bodyPart.created_at)}</Text>
                                <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>Risk: {bodyPart.risk}</Text>
                            </View>              
                            <View  style={SingleSlugStyle.melanomaBoxR}>
                                <Text style={{color:"white",marginRight:10,fontWeight:"700",opacity:0.8}}>Data</Text>
                                <MaterialCommunityIcons 
                                    name="arrow-right"
                                    size={25}
                                    color={"white"}
                                    opacity={"0.8"}
                                />
                            </View>
                            </TouchableOpacity>
                            {melanomaHistory.length != 0 && 
                                melanomaHistory.map((data,index) => (
                                <TouchableOpacity key={index} onPress={() => {setHighlighted(data.storage_name);setSelectedMelanoma(data);moleDataRef.current.scrollTo({ x: 0, y: 0, animated: true });}}  style={[SingleSlugStyle.melanomaBox, highlight != data.storage_name && {borderColor:"white"}]}>                                    
                                    <Image 
                                        source={{ uri:data.melanomaPictureUrl}}
                                        style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                                    />
                                    <View style={SingleSlugStyle.melanomaBoxL}>                            
                                        <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{formatTimestampToString(data.created_at)}</Text>
                                        <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>Risk: {data.risk}</Text>
                                    </View>              
                                    <View  style={SingleSlugStyle.melanomaBoxR}>
                                        <Text style={{color:"white",marginRight:10,fontWeight:"700",opacity:0.8}}>Data</Text>
                                    <MaterialCommunityIcons 
                                            name="arrow-right"
                                            size={25}
                                            color={"white"}
                                            opacity={"0.8"}
                                        />
                                    </View>
                                    </TouchableOpacity>
                                ))

                            }                        
                    </View>                             
    
                </View>

                <View style={[{marginTop:50,width:"100%",alignItems:"center",zIndex:20,marginBottom:50,borderTopWidth:1,paddingTop:30}]}>
                    <TouchableOpacity onPress={() => handleUpdateMole(bodyPart.melanomaId)} style={{width:"80%",backgroundColor:"black",borderColor:"magenta",borderWidth:2,padding:20,marginTop:0,alignItems:"center",borderRadius:100}}>
                        <Text style={{color:"white",fontWeight:"800"}}>Update this mole</Text>
                    </TouchableOpacity>
                </View>
            </View>
        }
        <LoadingOverlay 
            visible={diagnosisLoading}
        />
    </>
    )
}

const MalignantOrBeningDisplay = ({
    selectedMelanoma
}) => {
    return(
    <>
        {selectedMelanoma.risk > 0.5 ? 
        <View style={[{marginTop:20,alignItems:"center",width:"100%"}]}>                             
            <Text style={{color:"red",fontWeight:"800",marginTop:0,fontSize:30}}>Malignant</Text>
            <View style={[SingleSlugStyle.scoreCircle,{borderColor:"red"}]}>
                <Text style={[{fontSize:50,fontWeight:'bold'},{color:"red",opacity:0.5}]}>{selectedMelanoma.risk * 100}%</Text>
                <Text style={[{fontSize:9,fontWeight:700,maxWidth:"100%"},{color:"red",opacity:0.8}]}>Chance to be malignant</Text>
            </View>
        </View>
        :
        <View style={[{marginTop:20,alignItems:"center",width:"100%"}]}>                             
            <Text style={{color:"lightgreen",fontWeight:"800",marginTop:0,fontSize:30}}>Bening</Text>
            <View style={[SingleSlugStyle.scoreCircle,{borderColor:"lightgreen"}]}>
                <Text style={[{fontSize:50,fontWeight:'bold'},{color:"lightgreen",opacity:0.5}]}>{100 - selectedMelanoma.risk * 100}%</Text>
                <Text style={[{fontSize:9,fontWeight:700,maxWidth:"100%"},{color:"lightgreen",opacity:0.2}]}>Chance to be bening</Text>
            </View>
        </View>
        }
    </>
    )
}

const DiagnosisStarter = ({
    handleCallNeuralNetwork,
    selectedMelanoma
}) => {
    return(
        <View style={{width:"90%",alignItems:"center",paddingTop:30,backgroundColor:"black",borderBottomLeftRadius:30,borderBottomRightRadius:30}}>
        <Text style={{width:"90%",textAlign:"center",fontSize:10,color:"white",fontWeight:"800",opacity:0.3,marginBottom:5}}>Not started yet...</Text>
        <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"white",fontWeight:"800",opacity:0.6,marginBottom:40}}>Diagnosis</Text>                                
        <TouchableOpacity onPress={() => handleCallNeuralNetwork(selectedMelanoma.melanomaPictureUrl)} style={{width:"80%",padding:20,backgroundColor:"lightgray",alignItems:"center",borderRadius:30,marginBottom:50,borderColor:"black",borderWidth:2}}>
            <Text style={{fontWeight:"600",color:"black",opacity:0.8}}>Start Deep Learning AI Model</Text>
        </TouchableOpacity>
    </View>   
    )
}