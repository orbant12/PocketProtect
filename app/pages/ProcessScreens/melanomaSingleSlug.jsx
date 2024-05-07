import { View,Text,StyleSheet,Pressable,Animated,Image,ScrollView } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState,useEffect,useRef} from "react";
import * as ImagePicker from 'expo-image-picker';
import ProgressBar from 'react-native-progress/Bar';
import { dotSelectOnPart } from './melanomaDotSelect.jsx'


const MelanomaSingleSlug = ({route,navigation}) => {

    const [progress, setProgress] = useState(0.1)
    const [redDotLocation, setRedDotLocation] = useState({ x: -100, y: 10 });
    const bodyPart = route.params.data
    const gender = route.params.gender

    const [uploadedSpotPicture, setUploadedSpotPicture] = useState(null);
    const [currentSlugMemory, setCurrentSlugMemory ] = useState([])
    const [highlighted, setHighlighted] = useState()

    const scrollViewRef = useRef(null);

    const handlePartClick = (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setRedDotLocation({ x: locationX, y: locationY })    
    }

        const handlePictureUpload = async() => {
        //UPLOAD PICTURE OR OPEN CAMERA
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUploadedSpotPicture(result.assets[0].uri);
        }
    };  

    const BirthmarkIdGenerator = () => {
        return `Birthmark#${Math.floor(Math.random() * 100)}`
    }


    const handleMoreBirthmark = () => {
        const ID =  BirthmarkIdGenerator()
        setCurrentSlugMemory([...currentSlugMemory,
            {
                location: redDotLocation,
                id: ID,
                picture: uploadedSpotPicture,
            }
        ])
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
        setHighlighted(ID);
        setUploadedSpotPicture(null)
    }

    const handleMarkeAsComplete = () => {
        //UPLOAD
    }


    function SecoundScreen(){
        return(
            <View style={styles.startScreen}>
                <ScrollView ref={scrollViewRef} style={{marginTop:30}}>  
                    <View 
                        style={{
                            width:"100%",
                            alignItems:"center",
                            marginBottom:30
                        }}
                    >
                        <Text 
                            style={{
                                fontWeight:"400",
                                marginTop:10,
                                padding:10,
                                backgroundColor:"lightgray",
                                alignSelf:"flex-end"
                            }}
                        >
                            Part: <Text style={{fontWeight:"600"}}>{bodyPart.slug}</Text>
                        </Text>
                        <View style={{flexDirection:"column",width:"90%",marginTop:-20}}>
                            <Text>Body Parts <Text style={redDotLocation.x == -100 ? {opacity:0.3}:{color:"green",fontWeight:600}}>1/2</Text></Text>
                            <Text style={{fontSize:20,fontWeight:600}}>Where is your spot ?</Text>
                        </View>

                        <Pressable style={{position:"relative",alignItems:"center",justifyContent:"center",width:"500px",height:"500px",marginTop:20}} onPress={(e) => handlePartClick(e)}>
                                {dotSelectOnPart({
                                    bodyPart,
                                    redDotLocation,
                                    currentSlugMemory,
                                    gender: gender,
                                    highlighted
                                })}
                        </Pressable>

                        <View style={{width:"100%",alignItems:"center",marginBottom:10,marginTop:0}}>
                            <View style={{flexDirection:"column",width:"90%",marginTop:30}}>
                                <Text>Final Step <Text style={uploadedSpotPicture == null ? {opacity:0.3}:{color:"green",fontWeight:600}}>2/2</Text></Text>
                                <Text style={{fontSize:20,fontWeight:600}}>Take a picture of your spot</Text>
                                {uploadedSpotPicture == null ? (
                                    <>
                                        <View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",maxWidth:"100%",alignItems:"center",marginTop:20}}>
                                        <Image
                                            source={"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/melanoma/melanoma-skin-cancer-what-is-melanoma.jpg"}
                                            style={{width:150,height:150,borderWidth:1,borderRadius:10}}
                                        />

                                        <View style={{width:"50%",height:120,justifyContent:"space-between"}}>
                                            <Text style={{fontWeight:600,fontSize:13}}>Make sure your Image ...</Text>
                                            <Text style={{fontWeight:400,fontSize:10}}>• As clean as possible - remove all noise</Text>
                                            <Text style={{fontWeight:400,fontSize:10}} >• Lighting is simular to this image</Text>
                                            <Text style={{fontWeight:400,fontSize:10}}>• Birthmark is on the spotlight with the same ration as in this image</Text>
                                        </View>
                                        </View>
                                        <Pressable style={styles.uploadButton} onPress={handlePictureUpload}>
                                            <Text style={{color:"white"}}>Upload</Text>
                                        </Pressable>

                                    </>
                                    ):(
                                        <View style={{flexDirection:"column",width:"100%",alignItems:"center",justifyContent:"space-between",height:220,marginBottom:20}}>
                                            <Image
                                                source={{uri: uploadedSpotPicture}}
                                                style={{width:150,height:150,borderWidth:1,borderRadius:10,marginTop:20}}
                                            />
                                            <Pressable onPress={() => setUploadedSpotPicture(null)} style={{borderWidth:2,borderRadius:10,borderColor:"red"}}>
                                                <MaterialCommunityIcons
                                                    name="close"
                                                    size={30}
                                                    color="red"
                                                    style={{padding:2}}
                                                />
                                            </Pressable>
                                        </View>
                                    )
                                }
                            </View>
                            {currentSlugMemory.length != 0 ? <View style={{width:"100%",borderWidth:1,marginBottom:10}} />:null}
                            {currentSlugMemory.length != 0 ?
                                currentSlugMemory.map((data) => (
                                    <>
                                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:300,borderWidth:0.8,borderColor:"lightgray",padding:10,marginTop:10,borderRadius:20}}>
                                            <Image
                                                source={{uri:`${data.picture}`}}
                                                style={{width:75,height:75,borderWidth:1,borderRadius:10,}}
                                            />
                                            <Text>{data.id}</Text>
                                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                                <MaterialCommunityIcons
                                                    name="eye"
                                                    size={25}
                                                    color={highlighted == data.id ? "red" : "black"}
                                                    style={{padding:2}}
                                                    onPress={() => {setHighlighted(data.id); scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });}}
                                                />
                                                <MaterialCommunityIcons
                                                        name="delete"
                                                        size={30}
                                                        color="red"
                                                        style={{padding:2,marginLeft:10}}
                                                    />
                                            </View>
                                        </View>
                                    </>
                                ))
                                :null
                            }
    
                        </View>
                        

                        <View style={{width:"100%",alignItems:"center",marginBottom:10,marginTop:30}}>
                
                        {redDotLocation.x != -100 && uploadedSpotPicture != null ? (
                            <Text style={{color:"green",fontWeight:300,fontSize:10,marginBottom:20}}>2/2 - All Steps Completed</Text> 
                        ):(
                            <Text style={{fontWeight:800,opacity:0.5,fontSize:10,marginBottom:20,color:"red"}}>Not All Steps Completed</Text>
                        )}
                        
                            <Pressable onPress={handleMoreBirthmark} style={styles.MoreSpotButton}>
                                <Text style={{padding:15,color:"white",fontWeight:"700"}}>More birthmarks on my {bodyPart.slug}</Text>
                            </Pressable>

                            <Pressable onPress={handleMarkeAsComplete} style={styles.AllSpotButton}>
                                <Text style={{padding:15,color:"black",fontWeight:"500"}}>Marked all birthmarks</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }


    return(
        <View style={styles.container}>

            <View style={styles.ProgressBar}>
                <ProgressBar progress={progress} width={350} height={10} color={"magenta"}backgroundColor={"white"} />
            </View>
            {SecoundScreen()}       
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        width:"100%",
        height:"100%",
        justifyContent:"center"
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        height:"100%",
        justifyContent:"space-between"
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:10
    },
    backButton:{
        borderWidth:0,
        alignItems:"center",
        width:"40%",
        borderRadius:20,
    },
    bar: {
        height: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        },
    ProgressBar:{
        width:"100%",
        alignItems:"center",
        borderWidth:0,
        padding:10,
        position:"absolute",
        top:0,
        backgroundColor:"lightgray"
    },
    saveButtonActive: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
        marginBottom: 10,
    },
    saveButtonInActive: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
        marginBottom: 10,
        opacity:0.5
    },
    uploadButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems:"center",
        justifyContent:"center",
        marginTop: 30,
        marginBottom:30,
    },
    positionSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginTop: 10,
        width:"45%",
        borderWidth: 1,
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 10,
    
    },
    OwnSlugAddBtn: {
        width: "80%",
        height: 50,
        backgroundColor: "lightgrey",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft:"auto",
        marginRight:"auto",
    },
    MoreSpotButton:{
        backgroundColor:"magenta",
        borderRadius:10,
        marginBottom:20,
        width:250,
        alignItems:"center",
        borderWidth:1
    },
    AllSpotButton:{
        backgroundColor:"white",
        borderRadius:10,
        borderWidth:1,
        width:250,
        alignItems:"center",
        opacity:0.8
    }
})

export default MelanomaSingleSlug