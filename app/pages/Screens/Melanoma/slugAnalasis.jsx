import { useEffect,useState } from "react";
import { View, StyleSheet,ScrollView,Text, Pressable } from "react-native";
import { useAuth } from "../../../context/UserAuthContext";


import { fetchAllMelanomaSpotData } from "../../../server";

import { dotsSelectOnPart } from "./components/selectedSlugDots";

const SlugAnalasis = ({ route,navigation }) => {

//<***************************  Variables ******************************************>

    const [melanomaData, setMelanomaData] = useState([]);
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
        }
    }

    useEffect(() => {
        fetchAllMelanomaData();
    },[])

    const handleSpotOpen = (data) => {
        navigation.navigate("SinglePartAnalasis",{ "data": data });
    }

//<***************************  Components ******************************************>



return(
    <View style={styles.container}>
        <View style={styles.TopPart}>
            {melanomaData != null ? dotsSelectOnPart({
                bodyPart: bodyPart,
                melanomaData: melanomaData,
                gender
            }):null}
        </View>
        <View style={styles.BirthmarkContainer}>
            <ScrollView style={{width:"100%"}} >
                {melanomaData.map((data,index) => (
                    data.melanomaDoc.spot[0].slug == bodyPart.slug  ? (
                    <View key={index} style={styles.melanomaBox}>
                        <View style={styles.melanomaBoxL}>
                            <Text style={{fontSize:16,fontWeight:600}}>{data.melanomaId}</Text>
                            <Text style={{fontSize:13,fontWeight:500}}>Risk: 0.3</Text>
                        </View>
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
        width: "100%",
        height: 100,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        flexDirection: "row",
    },
    melanomaBoxL: {
        width: "80%",
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
    }

})

export default SlugAnalasis;