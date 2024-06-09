import React,{ useState,useCallback } from "react";
import { View, StyleSheet,ScrollView,Text, Pressable,TouchableOpacity,RefreshControl,Image } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fetchSlugMelanomaData,updateCompletedParts,fetchCompletedParts } from "../../../services/server";
import { dotsSelectOnPart } from "./components/selectedSlugDots";
import { Navigation_SingleSpotAnalysis, Navigation_AddSlugSpot } from "../../../navigation/navigation"
import { useFocusEffect } from '@react-navigation/native';
import { NavBar_Slug } from "../../../components/LibaryPage/Melanoma/navBarRow";
import { SlugStyles } from "../../../styles/libary_style";

const SlugAnalasis = ({ route,navigation }) => {

//<==================<[ Variables ]>====================>

    const [melanomaData, setMelanomaData] = useState([]);
    const [highlighted, setHighlighted] = useState(null);
    const [ completedParts, setCompletedParts] = useState([])
    const [refreshing, setRefreshing] = useState(false);
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

    useFocusEffect(
        React.useCallback(() => {
        fetchAllMelanomaData();     
        fetchAllCompletedParts();  
        return () => {};
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAllMelanomaData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    }, []);


return(
    <View style={SlugStyles.container}>
        <NavBar_Slug 
            completedParts={completedParts}
            handleAddMelanoma={handleAddMelanoma}
            handleComplete={handleComplete}
            bodyPart={bodyPart}
            navigation={navigation}
        />
        <View style={SlugStyles.TopPart }>
            {melanomaData != null ? dotsSelectOnPart({
                bodyPart: bodyPart,
                melanomaData: melanomaData,
                gender,
                highlighted,
                skin_type
            }):null}
            {!completedParts.includes(bodyPart.slug)? <Text style={{position:"absolute",top:10,right:10,fontSize:10,fontWeight:"700",color:"red",opacity:0.3}} >Not marked as complete</Text> : <Text style={{position:"absolute",top:10,right:10,fontSize:10,fontWeight:"700",color:"green",opacity:0.4}} >Marked as complete</Text>}
        </View>
        <View style={SlugStyles.BirthmarkContainer}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['magenta']} 
                        tintColor={'magenta'}       
                    />
                }
                style={{width:"100%",height:"100%"}} 
            >
                {melanomaData.length != 0 ?
                <View style={{width:"100%",alignItems:"center",marginBottom:250}}>                               
                    {melanomaData.map((data,index) => (
                        data.melanomaDoc.spot[0].slug == bodyPart.slug  ? (
                            <MoleBar
                                index={index}
                                data={data}
                                handleSpotOpen={handleSpotOpen}
                                highlighted={highlighted}
                                showSpot={showSpot}
                            />
                        ):null
                    ))}
                </View>
                :
                <AddSection handleAddMelanoma={handleAddMelanoma} />
                }
                </ScrollView>
                
        </View>
    </View>
)}

export default SlugAnalasis;



const AddSection = ({handleAddMelanoma}) => {
    return(        
        <View style={{alignItems:"center",marginTop:50}}>
            <MaterialCommunityIcons 
                name="camera-document-off"
                color={"white"}
                size={50}
            />
            <Text style={{marginTop:20,fontSize:22,maxWidth:"93%",textAlign:"center",fontWeight:"700",color:"white",opacity:0.4}}>This body part does not contain registered moles</Text>
            <TouchableOpacity onPress={() => handleAddMelanoma()} style={{marginTop:20,padding:10,borderWidth:2,borderRadius:30,alignItems:"center",paddingHorizontal:20, borderColor:"black",opacity:0.3,backgroundColor:"white"}}>
                <Text style={{fontWeight:"550",color:"black"}}>Let's fix that ...</Text>
            </TouchableOpacity>
        </View>           
    )
}

const MoleBar = ({
    data,
    handleSpotOpen,
    index,
    highlighted,
    showSpot
}) => {
    return(
        <TouchableOpacity onPress={() => handleSpotOpen(data)} key={index} style={SlugStyles.melanomaBox}>
        <Image 
            source={{ uri:data.melanomaPictureUrl}}
            style={{width:80,height:80,borderWidth:1,borderRadius:10}}
        />
        <View style={SlugStyles.melanomaBoxL}>                            
            <Text style={{fontSize:16,fontWeight:600,color:"white"}}>{data.melanomaId}</Text>
            <Text style={{fontSize:13,fontWeight:500,color:"white",opacity:0.6}}>Risk: {data.risk}</Text>
        </View>
        <Pressable onPress={() => showSpot(data.melanomaId)} style={highlighted != data.melanomaId ? SlugStyles.melanomaShowBoxI : SlugStyles.melanomaShowBoxA}>
            <MaterialCommunityIcons 
                name="eye"
                size={25}                       
            />
        </Pressable>
        <Pressable onPress={() => handleSpotOpen(data)} style={SlugStyles.melanomaBoxR}>
        <MaterialCommunityIcons 
                name="arrow-right"
                size={25}
                color={"white"}
            />
        </Pressable>
    </TouchableOpacity>
    )
}