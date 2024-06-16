import { View,Text } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { NavBar_OneOption } from "../Common/navBars"
import { SideSwitch } from "../LibaryPage/Melanoma/sideSwitch"
import Body from "../../components/LibaryPage/Melanoma/BodyParts/index";
import React,{ useEffect, useState } from "react";
import { spotUploadStyle,Mstyles } from "../../styles/libary_style";
import { fetchUserData, fetchAllMelanomaSpotData, } from "../../services/server";
import { useAuth } from "../../context/UserAuthContext";
import { decodeParts } from "../../utils/melanoma/decodeParts";

export const ManualAdd_Moles = ({
    closeAction
}) => {

    const [ selectedSide, setSelectedSide] = useState("front")
    const [ userData, setUserData] = useState([])
    const [ affectedSlugs,setAffectedSlugs ] = useState([])
    const [melanomaData, setMelanomaData] = useState([])
    const { currentuser } = useAuth()

    const handleBodyPartSelected = (slug) => {

    }


    const fetchAllUserData = async () => {
        const response = await fetchUserData({
            userId:currentuser.uid
        })
        setUserData(response.data())
    }

    
    const AffectedSlugMap = (melanomaData) => {
        if(melanomaData != null){
            const affectedSlug = melanomaData.map((data, index) => {
                const spotSlug = data.melanomaDoc.spot[0]?.slug;
                const intensity = data.risk >= 0.3 ? (data.risk >= 0.8 ? 1 : 3) : 2;
                return { slug: spotSlug, intensity, key: index }; // Adding a unique key
            });
            setAffectedSlugs(affectedSlug);
            console.log(affectedSlug[0])
        }
    }

    const fetchAllMelanomaData = async () => {
        if(currentuser && userData.length != 0){
            const response = await fetchAllMelanomaSpotData({
                userId: currentuser.uid,
                gender:userData.gender
            });
            const melanomaData = response;
            if(melanomaData != false){
                setMelanomaData(melanomaData);
                AffectedSlugMap(melanomaData)
            } else {
                setMelanomaData([])
            }
        }
    }

    useEffect(() => {
        fetchAllUserData()
        fetchAllMelanomaData()
    },[])

    return(
        <View style={{width:"100%",height:"100%",alignItems:"center"}}>
            <NavBar_OneOption 
                title={"Select moles for review"}
                icon_left={{name:"arrow-left",size:30,action:closeAction}}
                //icon_right={{name:"arrow-right",size:30}}
            />
            <View>
                <Text>0 Selected Moles</Text>
            </View>
            <View style={{marginTop:0,alignItems:"center",width:"100%",height:"70%",justifyContent:"space-between"}}>            
                    <Body
                        data={affectedSlugs}
                        gender={userData.gender}
                        side={selectedSide}
                        scale={1.2}
                        //RED COLOR INTESITY - 2 = Light Green color hash --> #00FF00
                        colors={['#FF0000', '#A6FF9B','#FFA8A8']}
                        onBodyPartPress={(slug) => handleBodyPartSelected(slug)}
                        zoomOnPress={true}
                    />
                    <View style={[Mstyles.colorExplain,{top:250}]}>
                        <View style={Mstyles.colorExplainRow} >
                            <View style={Mstyles.redDot} />
                            <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>Higher risk</Text>
                        </View>
        
                        <View style={Mstyles.colorExplainRow}>
                            <View style={Mstyles.greenDot} />
                            <Text style={{position:"relative",marginLeft:10,fontWeight:500,opacity:0.8}}>No risk</Text>
                        </View>
                    </View>
                    <SideSwitch 
                        selectedSide={selectedSide}
                        setSelectedSide={setSelectedSide}
                        spotUploadStyle={spotUploadStyle}
                    />
            </View>
        </View>
    )
}

