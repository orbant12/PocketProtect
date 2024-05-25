import { useEffect,useState,useCallback } from "react";
import { View, StyleSheet,ScrollView,Text, Pressable,TouchableOpacity,RefreshControl,Image } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {fetchSlugMelanomaData } from "../../../server";

import { dotsSelectOnPart } from "./components/selectedSlugDots";

const SlugAnalasis = ({ route,navigation }) => {

//<***************************  Variables ******************************************>

    const [melanomaData, setMelanomaData] = useState([]);
    const [highlighted, setHighlighted] = useState(null);
    const { currentuser } = useAuth();   
    const bodyPart = route.params.data;
    const skin_type = route.params.skin_type;
    const userData = route.params.userData;
    const gender = userData.gender

//<***************************  Functions ******************************************>

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

    useEffect(() => {
        fetchAllMelanomaData();       
    },[])

    const handleSpotOpen = (data) => {
        navigation.navigate("SinglePartAnalasis",{ "data": data,"gender":gender,skin_type:skin_type, userData });
    }

    const showSpot = (melanomaId) => {
        if(melanomaId == highlighted){
            setHighlighted("")
        } else {
            setHighlighted(melanomaId);
        }

    }

    const handleAddMelanoma = () => {
        navigation.navigate("MelanomaAdd", { data: userData, skin_type: skin_type, bodyPart:bodyPart,type:"new"});
    }


    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAllMelanomaData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // Example: setTimeout for simulating a delay
    }, []);


//<***************************  Components ******************************************>



return(
    <View style={styles.container}>
        <View style={styles.TopPart }>
            {melanomaData != null ? dotsSelectOnPart({
                bodyPart: bodyPart,
                melanomaData: melanomaData,
                gender,
                highlighted,
                skin_type
            }):null}
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
                <View style={{width:"100%",alignItems:"center",paddingBottom:150}}>           
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
        borderBottomWidth:10
    },
    BirthmarkContainer: {
        width: "100%",        
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"rgba(0,0,0,0.86)"
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