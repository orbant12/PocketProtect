import { SingleSlugStyle } from "../../../../../styles/libary_style";
import { styles_shadow } from "../../../../../styles/shadow_styles";
import {dateDistanceFromToday, DateToString} from "../../../../../utils/date_manipulations";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SpotData } from "../../../../../utils/types";
import { OneOptionBox } from "../../boxes/oneOptionBox";
import { DiagnosisProcessModal } from "../../../../Common/AnimationSheets/diagnosisAnimation";
import { CameraViewModal } from "../../../../../pages/Libary/Melanoma/components/cameraModal";
import { useState } from "react";
import { useAuth } from "../../../../../context/UserAuthContext";
import { ImageLoaderComponent } from "../../../../Common/imageLoader";



export const MoleTab = ({
    moleDataRef,
    navigation,
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
    handleCallNeuralNetwork,
    setDiagnosisLoading,
}:
{
    moleDataRef: any;
    bodyPart: SpotData | null;
    selectedMelanoma: SpotData | null;
    diagnosisLoading: "loading" | "first_loaded" | "repeat_loaded" | null;
    setDiagnosisLoading:(diagnosisLoading:"first_loaded" | "repeat_loaded"| null | "loading") => void;
    setDeleteModal:(deleteModal:boolean) => void;
    setMoleToDelete:(moleToDelete:SpotData) => void;
    deleteModal: boolean;
    setHighlighted:(highlight:string) => void;
    highlight: string | null;
    setSelectedMelanoma:(selectedMelanoma:SpotData) => void;
    melanomaHistory: SpotData[];
    handleUpdateMole:(moleId:string) => void;
    handleCallNeuralNetwork:(molePictureUrl:string,type:"first_loaded" | "repeat_loaded" ) => void;
    navigation: any;
}) => {

    const [warningRepeatActive,setWarningRepeatActive] = useState(false);
    const [newMoleImage,setNewMoleImage] = useState(null);

    const { currentuser, melanoma } = useAuth();

    const toggleCameraOverlay = (type:"back" | "finish") => {
        setWarningRepeatActive(!warningRepeatActive);
        if (type == "finish") {
            setDiagnosisLoading(null)
        } else {
            setDiagnosisLoading("repeat_loaded");
        }
    };
    return(
        <>
        {bodyPart != null &&
            <View style={[SingleSlugStyle.container,styles_shadow.shadowContainer]}>
                <OneOptionBox
                    navigation={navigation}
                    buttonTitle="How it works ?"
                    subTitle="100% Transparency - Open Source"
                    mainTitle="Our AI Model"
                    image={require("../../../../../assets/ai.png")}
                    bgColor="white"
                    id="ai_model"
                />
            {selectedMelanoma != null && bodyPart != null &&
                selectedMelanoma.risk != null ?
                    <MalignantOrBeningDisplay 
                        selectedMelanoma={selectedMelanoma}
                        handleCallNeuralNetwork={handleCallNeuralNetwork}
                    />
                    :
                    <DiagnosisStarter 
                        handleCallNeuralNetwork={handleCallNeuralNetwork}
                        selectedMelanoma={selectedMelanoma}
                    />                    
            }         
                <View style={[{marginTop:50,alignItems:"center",width:"100%",borderTopWidth:0.3,paddingTop:30}]} >
                <Text style={{color:"black",opacity:0.6,fontWeight:"600",marginBottom:5,fontSize:10}}>{selectedMelanoma != null ? selectedMelanoma.storage_name : null}</Text> 
                    <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"black",fontWeight:"800",opacity:1}}>Mole Data</Text>
                    {selectedMelanoma != null && bodyPart != null &&
                    <>
                        <View style={[SingleSlugStyle.melanomaBox, highlight != selectedMelanoma.storage_name && {borderColor:"white"}]}>
                            <ImageLoaderComponent
                                w={80}
                                h={80}
                                style={{borderWidth:1,borderRadius:10}}
                                data={selectedMelanoma}
                            />
                            <View style={SingleSlugStyle.melanomaBoxL}>                            
                                <Text style={{fontSize:14,fontWeight:"600",color:"black"}}>{selectedMelanoma.melanomaId}</Text>
                                <Text style={{fontSize:13,fontWeight:"500",color:"black",opacity:0.6}}>{DateToString(selectedMelanoma.created_at)}</Text>
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
                        <View style={{backgroundColor:"white",padding:20,alignItems:"center",borderBottomLeftRadius:30,borderBottomRightRadius:30}}>
                        <View style={{width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginTop:20,borderBottomWidth:0.3,paddingBottom:30}}>
                            <Text style={{fontWeight:"700",fontSize:20,color:"black"}}>State:</Text>
                            {dateDistanceFromToday(selectedMelanoma.created_at) != 0 ? 
                                dateDistanceFromToday(selectedMelanoma.created_at) > 0 ?                           
                                <Text style={{fontSize:15,fontWeight:"800",maxWidth:"60%",color:"black",opacity:0.8}}>Your mole is up to date for <Text style={{color:"green",fontWeight:"800",opacity:0.9}}>{dateDistanceFromToday(selectedMelanoma.created_at)} days</Text></Text>                  
                            :                         
                                <Text style={{fontSize:15,maxWidth:"70%",fontWeight:"600",color:"black",opacity:0.8}}>This mole has been outdated for <Text style={{color:"red",fontWeight:"800",opacity:0.5}}>{dateDistanceFromToday(selectedMelanoma.created_at) * -1} days</Text></Text>    
                            :
                                <Text style={{fontSize:15,maxWidth:"70%",fontWeight:"600",color:"black",opacity:0.8}}>This mole is getting outdated <Text style={{color:"green",fontWeight:"800",opacity:0.5}}>Today</Text></Text>                         
                            }
                        </View>
                        <View style={{width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginTop:30,borderBottomWidth:0.3,paddingBottom:30}}>
                            <Text style={{fontWeight:"700",fontSize:20,color:"black"}}>Prediction:</Text>
                            <Text style={[{fontWeight:"800",fontSize:16,color:"black",opacity:1} ,selectedMelanoma.risk == null && {opacity:0.1}]}>
                                {selectedMelanoma.risk == null? "Not Analised" : selectedMelanoma.risk < 0.5 ? "bening" : "malignant"}
                            </Text>
                            
                        </View>   
                        <View style={{width:"80%",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginTop:30,borderBottomWidth:0.3,paddingBottom:30}}>
                            <Text style={{fontWeight:"700",fontSize:20,color:"black"}}>Body Part:</Text>
                            <Text style={{fontWeight:"800",fontSize:16,color:"black",opacity:0.8}}>{selectedMelanoma.melanomaDoc.spot.slug}</Text>
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
                    <View style={[SingleSlugStyle.container,{marginTop:50,borderTopWidth:0.3,paddingTop:30}]}>
                        <Text style={{color:"black",opacity:0.6,fontWeight:"600",marginBottom:5,fontSize:10}}>Latest to oldest</Text> 
                        <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"black",fontWeight:"800",opacity:1}}>History</Text>                                     
                            <TouchableOpacity onPress={() => {setHighlighted(bodyPart.storage_name); setSelectedMelanoma(bodyPart); moleDataRef.current.scrollTo({ x: 0, y: 0, animated: true }); }}  style={[SingleSlugStyle.melanomaBox,{borderColor:"magenta",borderWidth:2}, highlight != bodyPart.storage_name && {borderColor:"black",borderWidth:0.3}]}>
                            <Text style={[{color:"magenta",opacity:0.6, fontWeight:"700",top:-22,position:"absolute",left:10},highlight != bodyPart.storage_name && {color:"white"}]}>Latest</Text>
                            <Image 
                                source={{ uri:bodyPart.melanomaPictureUrl}}
                                style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                            />
                            <View style={SingleSlugStyle.melanomaBoxL}>                            
                                <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>{DateToString(bodyPart.created_at)}</Text>
                                <Text style={{fontSize:12,fontWeight:"600",color:"black",opacity:0.6,marginTop:2}}>Risk: <Text style={{fontSize:10,fontWeight:"800"}}>{bodyPart.risk == null ? "Not analised" : Math.round(bodyPart.risk * 100) / 100}</Text></Text>
                            </View>              
                            <View  style={SingleSlugStyle.melanomaBoxR}>
                                <Text style={{color:"white",marginRight:10,fontWeight:"700",opacity:0.8}}>Data</Text>
                                <MaterialCommunityIcons 
                                    name="arrow-right"
                                    size={25}
                                    color={"magenta"}
                                    style={{opacity:0.8}}
                                />
                            </View>
                            </TouchableOpacity>
                            {melanomaHistory &&
                            melanomaHistory.length != 0 && 
                                melanomaHistory.map((data,index) => (
                                <TouchableOpacity key={index} onPress={() => {setHighlighted(data.storage_name);setSelectedMelanoma(data);moleDataRef.current.scrollTo({ x: 0, y: 0, animated: true });}}  style={[SingleSlugStyle.melanomaBox,{borderColor:"magenta",borderWidth:2}, highlight != data.storage_name && {borderColor:"black",borderWidth:0.3},]}>                                    
                                    <Image 
                                        source={{ uri:data.melanomaPictureUrl}}
                                        style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                                    />
                                    <View style={SingleSlugStyle.melanomaBoxL}>                            
                                        <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>{DateToString(data.created_at)}</Text>
                                        <Text style={{fontSize:12,fontWeight:"600",color:"black",opacity:0.6,marginTop:2}}>Risk: <Text style={{fontSize:10,fontWeight:"800"}}>{data.risk == null ? "Not analised" :Math.round(data.risk * 100) / 100}</Text> </Text>
                                    </View>              
                                    <View  style={SingleSlugStyle.melanomaBoxR}>
                                        <Text style={{color:"white",marginRight:10,fontWeight:"700",opacity:0.8}}>Data</Text>
                                    <MaterialCommunityIcons 
                                            name="arrow-right"
                                            size={25}
                                            color={"magenta"}
                                            style={{opacity:0.8}} 
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
        <DiagnosisProcessModal
            loading={diagnosisLoading}
            setLoading={(e:"repeat_loaded" | null) => {
                if (e !== "repeat_loaded") {
                    setDiagnosisLoading(e);
                } else {
                    setDiagnosisLoading(null);
                    setWarningRepeatActive(true);
                }
            }}
            imageSource={selectedMelanoma != null ? selectedMelanoma.melanomaPictureUrl : null}
            selectedMelanoma={selectedMelanoma}
            navigation={navigation}
        />

        <CameraViewModal
            isCameraOverlayVisible={warningRepeatActive}
            setUploadedSpotPicture={async (e) => {
                setDiagnosisLoading(null)
                await melanoma.updateSpotPicture({spotId:selectedMelanoma.melanomaId,pictureToUpdate:e});
                handleCallNeuralNetwork(e,"repeat_loaded");}}
            toggleCameraOverlay={toggleCameraOverlay}
        />
    </>
    )
}






const MalignantOrBeningDisplay = ({
    selectedMelanoma,
    handleCallNeuralNetwork
}:{
    selectedMelanoma:SpotData;
    handleCallNeuralNetwork:(molePictureUrl:string,type:"first_loaded" | "repeat_loaded") => void;
}) => {
    return(
    <View style={[{width:"85%",padding:30,alignItems:"center",backgroundColor:"white",borderBottomLeftRadius:30,borderBottomRightRadius:30,zIndex:-1}]}>
        {selectedMelanoma.risk > 0.5 ? 
        <View style={[{marginTop:0,alignItems:"center",width:"100%"}]}>                             
            <Text style={{color:"red",fontWeight:"800",marginTop:0,fontSize:30}}>Malignant</Text>
            <View style={[SingleSlugStyle.scoreCircle,{borderColor:"red"}]}>
                <Text style={[{fontSize:50,fontWeight:"700"},{color:"red",opacity:0.5}]}>{Math.round(selectedMelanoma.risk * 100)}%</Text>
                <Text style={[{fontSize:9,fontWeight:"700",maxWidth:"100%"},{color:"red",opacity:0.8}]}>Chance to be malignant</Text>
            </View>
        </View>
        :
        <View style={[{marginTop:0,alignItems:"center",width:"100%"}]}>                             
            <Text style={{color:"black",fontWeight:"800",marginTop:0,fontSize:30}}>Bening</Text>
            <View style={[SingleSlugStyle.scoreCircle,{borderColor:"lightgreen"}]}>
                <Text style={[{fontSize:50,fontWeight:"700"},{color:"black",opacity:1}]}>{100 - Math.round(selectedMelanoma.risk * 100)}%</Text>
                <Text style={[{fontSize:9,fontWeight:"700",maxWidth:"100%"},{color:"black",opacity:1}]}>Chance of being bening</Text>
            </View>
        </View>
        }

    <View style={[{width:"100%",alignItems:"center",padding:0,backgroundColor:"white",borderBottomLeftRadius:30,borderBottomRightRadius:30,zIndex:-1,paddingTop:30}]}>    
        <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"black",fontWeight:"800",opacity:0.6,marginBottom:25}}>Diagnosis</Text>                            
        <TouchableOpacity onPress={() => handleCallNeuralNetwork(selectedMelanoma.melanomaPictureUrl,"repeat_loaded")}   style={[{width:"100%",padding:20,backgroundColor:"white",alignItems:"center",borderRadius:10,marginBottom:20,borderColor:"black",borderWidth:2},styles_shadow.hightShadowContainer]}>
            <Text style={{color:"black",opacity:0.8,fontWeight:"700",fontSize:16}}>Reanalyze with Deep Learning</Text>
        </TouchableOpacity>
        <Text style={{width:"90%",textAlign:"center",fontSize:10,color:"black",fontWeight:"800",opacity:0.3,marginBottom:5}}>Our AI has 90% accuracy !</Text>
    </View>   
    </View>
    )
}



const DiagnosisStarter = ({
    handleCallNeuralNetwork,
    selectedMelanoma
}:{
    handleCallNeuralNetwork:(molePictureUrl:string,type:"first_loaded" | "repeat_loaded") => void;
    selectedMelanoma:SpotData;
}) => {
    return(
        <View style={[{width:330,alignItems:"center",padding:20,backgroundColor:"white",borderBottomLeftRadius:30,borderBottomRightRadius:30,zIndex:-1,paddingTop:30}]}>
        <Text style={{width:"90%",textAlign:"center",fontSize:10,color:"black",fontWeight:"800",opacity:0.3,marginBottom:5}}>Our AI has 90% accuracy !</Text>
        <Text style={{width:"90%",textAlign:"center",fontSize:25,color:"black",fontWeight:"800",opacity:0.6,marginBottom:25}}>Diagnosis</Text>                                
        <TouchableOpacity onPress={() => handleCallNeuralNetwork(selectedMelanoma.melanomaPictureUrl,"first_loaded")}   style={[{width:"100%",padding:20,backgroundColor:"white",alignItems:"center",borderRadius:10,marginBottom:20,borderColor:"black",borderWidth:2},styles_shadow.hightShadowContainer]}>
            <Text style={{color:"black",opacity:0.8,fontWeight:"700",fontSize:16}}>Start Deep Learning AI Model</Text>
        </TouchableOpacity>
    </View>   
    )
}

