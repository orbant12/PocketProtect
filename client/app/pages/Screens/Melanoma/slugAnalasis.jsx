import React,{ useEffect,useState,useCallback } from "react";
import { View, StyleSheet,ScrollView,Text, Pressable,TouchableOpacity,RefreshControl,Image } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fetchSlugMelanomaData,updateCompletedParts,fetchCompletedParts } from "../../../server";
import { dotsSelectOnPart } from "./components/selectedSlugDots";
import { Navigation_SingleSpotAnalysis, Navigation_AddSlugSpot } from "../../../navigation/navigation"
import { useFocusEffect } from '@react-navigation/native';

const SlugAnalasis = ({ route,navigation }) => {

//<==================<[ Variables ]>====================>

    const [melanomaData, setMelanomaData] = useState([]);
    const [highlighted, setHighlighted] = useState(null);
    const [ completedParts, setCompletedParts] = useState([])
    const { currentuser } = useAuth();   
    const bodyPart = route.params.data;
    const skin_type = route.params.skin_type;
    const userData = route.params.userData;
    const gender = userData.gender
    const isCompleted = route.params.isCompleted

//<==================<[ Functions ]>====================>

    const fetchAllMelanomaData = async () => {
        if(currentuser){
            const response = await fetchSlugMelanomaData({
                userId: currentuser.uid,
                gender,
                slug: bodyPart.slug
            });
            const melanomaData = response;
            setMelanomaData(melanomaData);
            setHighlighted(melanomaData[0].melanomaId);
            console.log(melanomaData)            
        }
    }

    const fetchAllCompletedParts = async () => {
        if(currentuser){
            const response = await fetchCompletedParts({
                userId: currentuser.uid,
            });
            const completedSlugs = response.map(part => part.slug);     
            setCompletedParts(completedSlugs)            
        }
    }

    useFocusEffect(
        React.useCallback(() => {
        fetchAllMelanomaData();     
        fetchAllCompletedParts();  
        return () => {};
        }, [])
    );

    const showSpot = (melanomaId) => {
        if(melanomaId == highlighted){
            setHighlighted("")
        } else {
            setHighlighted(melanomaId);
        }
    }

    const handleComplete = async (type) => {

        let updatedCompletedParts;
    
        if (type === false) {
            updatedCompletedParts = [...completedParts, bodyPart.slug];
        } else if (type === true) {
            updatedCompletedParts = completedParts.filter(part => part !== bodyPart.slug);
        }
        const response = updatedCompletedParts.map(slug => {                
            return { slug: slug };
        });
        console.log(response)
        await updateCompletedParts({
            userId: currentuser.uid,
            completedArray: response
        });
            
        setCompletedParts(updatedCompletedParts);
    };
    
    const handleSpotOpen = (bodyPart) => {
        Navigation_SingleSpotAnalysis({
            bodyPart: bodyPart,
            userData:userData,
            gender:gender,
            skin_type:skin_type,
            navigation
        })
    }
    const handleAddMelanoma = () => {
        Navigation_AddSlugSpot({
            userData:userData,
            bodyPart:bodyPart,
            skin_type:skin_type,
            type: "new",
            navigation
        })
        console.log("222")
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAllMelanomaData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    }, []);


//<==================<[ Components ]>====================>



return(
    <View style={styles.container}>
            <View style={styles.ProgressBar}>
                <TouchableOpacity onPress={() => navigation.goBack({refresh:true})}  style={{backgroundColor:"black",borderRadius:30,borderColor:"white",borderWidth:2}}>
                    <MaterialCommunityIcons 
                        name="arrow-left"
                        size={25}
                        color={"white"}
                        style={{padding:5}}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>  handleAddMelanoma()} style={{width:"60%",height:50,borderWidth:2,justifyContent:"center",borderRadius:10,marginTop:0,marginBottom:0,flexDirection:"column",alignItems:"center",backgroundColor:"black",borderColor:"magenta",padding:10}}>
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
        <View style={styles.TopPart }>
            {melanomaData != null ? dotsSelectOnPart({
                bodyPart: bodyPart,
                melanomaData: melanomaData,
                gender,
                highlighted,
                skin_type
            }):null}
            {!completedParts.includes(bodyPart.slug)? <Text style={{position:"absolute",top:10,right:10,fontSize:10,fontWeight:"700",color:"red",opacity:0.3}} >Not marked as complete</Text> : <Text style={{position:"absolute",top:10,right:10,fontSize:10,fontWeight:"700",color:"green",opacity:0.4}} >Marked as complete</Text>}
        </View>
        <View style={styles.BirthmarkContainer}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['magenta']} 
                        tintColor={'magenta'}       
                    />
                }
                style={{width:"100%",height:"100%"}} >
                <View style={{width:"100%",alignItems:"center",marginBottom:250}}>           
                    <AddSection melanomaData={melanomaData} handleAddMelanoma={handleAddMelanoma} />
                    {melanomaData.map((data,index) => (
                        data.melanomaDoc.spot[0].slug == bodyPart.slug  ? (
                        <TouchableOpacity onPress={() => handleSpotOpen(data)} key={index} style={styles.melanomaBox}>
                            <Image 
                                source={{ uri:data.melanomaPictureUrl}}
                                style={{width:80,height:80,borderWidth:1,borderRadius:10}}
                            />
                            <View style={styles.melanomaBoxL}>                            
                                <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{data.melanomaId}</Text>
                                <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>Risk: {data.risk}</Text>
                            </View>
                            <Pressable onPress={() => showSpot(data.melanomaId)} style={highlighted != data.melanomaId ? styles.melanomaShowBoxI : styles.melanomaShowBoxA}>
                                <MaterialCommunityIcons 
                                    name="eye"
                                    size={25}                       
                                />
                            </Pressable>
                            <Pressable onPress={() => handleSpotOpen(data)} style={styles.melanomaBoxR}>
                            <MaterialCommunityIcons 
                                    name="arrow-right"
                                    size={25}
                                    color={"white"}
                                />
                            </Pressable>
                        </TouchableOpacity>
                        
                        ):null
                    ))}
                </View>
            </ScrollView>
        </View>
    </View>
)}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 110,
    },
    TopPart: {
        width: "100%",
        borderWidth: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"white",
        padding:10,
        marginTop:230,
        borderBottomWidth:10
    },
    BirthmarkContainer: {
        width: "100%",        
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"rgba(0,0,0,0.86)"
    },
    ProgressBar:{
        width:"100%",
        alignItems:"center",
        borderWidth:0,
        padding:10,
        position:"absolute",
        top:0,
        backgroundColor:"transparent",
        flexDirection:"row",
        justifyContent:"space-between",
        position:"absolute",
        top:40,
        zIndex:5   
    },
    melanomaBox: {
        maxWidth: "100%",
        width: "95%",
        height: 100,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor:"magenta",
        backgroundColor:"black",
        flexDirection: "row",
        borderRadius:10,
        marginRight:"auto",
        marginLeft:"auto",
        marginTop:20
    },
    melanomaBoxL: {
        width: "40%",
        height: "100%",
        justifyContent: "center",
        marginLeft:10,
        marginRight:10
    },
    melanomaBoxR: {

        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0,
        borderRadius: 10,
        marginLeft: 10,
        paddingVertical:10,
        paddingHorizontal:10,
        borderColor:"white"
    },
    melanomaShowBoxI: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0.3,
        borderRadius: 10,
        backgroundColor: "white",
        marginLeft: 10,
        padding:10
    },
    melanomaShowBoxA: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0.3,
        borderRadius: 10,
        backgroundColor: "red",
        marginLeft: 10,
        padding:10,
    }

})

export default SlugAnalasis;



const AddSection = ({melanomaData,handleAddMelanoma}) => {
    return(
        <>
        {melanomaData.length == 0 ? 
            <View style={{width:"100%",opacity:0.5,alignItems:"center",marginTop:30}}>
                <MaterialCommunityIcons 
                    name="camera-document-off"
                    size={30}
                    color={"white"}
                />
                <Text style={{fontWeight:"800",fontSize:20,textAlign:"center",marginTop:10,padding:10,color:"white"}}>No Mole registered on this body part ...</Text>
                <TouchableOpacity onPress={() => handleAddMelanoma()} style={{padding:30,marginTop:30,borderWidth:1,borderRadius:10,width:"80%",alignItems:"center",borderColor:"white",backgroundColor:"rgba(0,0,0,0.6)"}}>
                    <Text style={{fontWeight:"800",fontSize:15,color:"white"}}>+ Register new moles</Text>
                </TouchableOpacity>
            </View>   
            :
            <TouchableOpacity onPress={() => handleAddMelanoma()} style={{padding:30,marginTop:0,borderWidth:2,borderRadius:0,width:"100%",alignItems:"center",backgroundColor:"rgba(0,0,0,0.4)",marginRight:"auto",marginLeft:"auto"}}>
                <Text style={{fontWeight:"800",fontSize:16,color:"white",opacity:0.6}}>+ Register new moles</Text>
            </TouchableOpacity>             
            }   
        </>
    )
}