import { useEffect,useState } from "react";
import { View, StyleSheet,ScrollView,Text, Pressable } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";


import { fetchAllMelanomaSpotData } from "../../../server";

import { dotsSelectOnPart } from "./components/selectedSlugDots";

const SlugAnalasis = ({ route,navigation }) => {

//<***************************  Variables ******************************************>

    const [melanomaData, setMelanomaData] = useState([]);
    const [highlighted, setHighlighted] = useState(null);
    const { currentuser } = useAuth();
    const gender = route.params.gender
    const bodyPart = route.params.data;

//<***************************  Functions ******************************************>

    const fetchAllMelanomaData = async () => {
        if(currentuser){
            const response = await fetchAllMelanomaSpotData({
                userId: currentuser.uid,
                gender
            });
            const melanomaData = response;
            setMelanomaData(melanomaData);
            setHighlighted(melanomaData[0].melanomaId);
        }
    }

    useEffect(() => {
        fetchAllMelanomaData();
    },[])

    const handleSpotOpen = (data) => {
        navigation.navigate("SinglePartAnalasis",{ "data": data,"gender":gender });
    }

    const showSpot = (melanomaId) => {
        setHighlighted(melanomaId);
    }

//<***************************  Components ******************************************>



return(
    <View style={styles.container}>
        <View style={styles.TopPart}>
            {melanomaData != null ? dotsSelectOnPart({
                bodyPart: bodyPart,
                melanomaData: melanomaData,
                gender,
                highlighted
            }):null}
        </View>
        <View style={styles.BirthmarkContainer}>
            <ScrollView style={{width:"100%"}} >
                {melanomaData.map((data,index) => (
                    data.melanomaDoc.spot[0].slug == bodyPart.slug  ? (
                    <View key={index} style={styles.melanomaBox}>
                        <View style={styles.melanomaBoxL}>
                            <Text style={{fontSize:16,fontWeight:600}}>{data.melanomaId}</Text>
                            <Text style={{fontSize:13,fontWeight:500}}>Risk: {data.risk}</Text>
                        </View>
                        <Pressable onPress={() => showSpot(data.melanomaId)} style={highlighted != data.melanomaId ? styles.melanomaShowBoxI : styles.melanomaShowBoxA}>
                            <Text style={{fontSize:13,fontWeight:500}}>Show</Text>
                        </Pressable>
                        <Pressable onPress={() => handleSpotOpen(data)} style={styles.melanomaBoxR}>
                            <Text style={{fontSize:13,fontWeight:500}}>Open</Text>
                        </Pressable>
                    </View>
                    ):null
                ))}
                {melanomaData.length == 0 ? <Text>No Melanoma Data</Text>:null}
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
        paddingTop: 100,
    },
    TopPart: {
        width: "100%",
        borderWidth: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    BirthmarkContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    melanomaBox: {
        maxWidth: "100%",
        width: "100%",
        height: 100,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        flexDirection: "row",
    },
    melanomaBoxL: {
        width: "50%",
        height: "100%",
        justifyContent: "center",
    },
    melanomaBoxR: {
        width: "20%",
        height: "60%",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: 10,
    },
    melanomaShowBoxI: {
        width: "20%",
        height: "60%",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "white",
        marginLeft: 10,
    },
    melanomaShowBoxA: {
        width: "20%",
        height: "60%",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "red",
        marginLeft: 10,
    }

})

export default SlugAnalasis;