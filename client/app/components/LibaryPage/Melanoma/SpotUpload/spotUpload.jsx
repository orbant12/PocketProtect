import { View,Text,Pressable,TouchableOpacity, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import SampleImage from "../../../../assets/IMG_0626.jpg"
import { spotUpload_2_styles } from "../../../../styles/libary_style";

export function SpotUpload({
    uploadedSpotPicture,
    highlighted,
    toggleCameraOverlay,
    setUploadedSpotPicture,
}){
    return(
        <View style={[{width:"100%",alignItems:"center",marginBottom:10,paddingTop:10,marginTop:10,borderTopWidth:2},highlighted != "" && {paddingTop:100}]}>
        <View style={{flexDirection:"column",width:"90%",marginTop:30}}>
            <Text>Final Step <Text style={uploadedSpotPicture == null ? {opacity:0.3}:{color:"green",fontWeight:"600"}}>2/2</Text></Text>
            <Text style={{fontSize:20,fontWeight:"600"}}>Take a picture of your spot</Text>
            {uploadedSpotPicture == null ? (
                <>
                    <View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",maxWidth:"100%",alignItems:"center",marginTop:20}}>
                    <Image
                        source={SampleImage}
                        style={{width:140,height:140,borderWidth:0.3,borderRadius:10}}
                    />

                    <View style={{width:"52%",height:120,justifyContent:"space-between",borderLeftWidth:0.3,paddingLeft:10}}>
                        <Text style={{fontWeight:"600",fontSize:12}}>Make sure your Image ...</Text>
                        <Text style={{fontWeight:"400",fontSize:10}}>As clean as possible - remove all noise</Text>
                        <Text style={{fontWeight:"400",fontSize:10}} >Lighting is simular to this image</Text>
                        <Text style={{fontWeight:"400",fontSize:10}}>Birthmark is on the spotlight with the same ration as in this image</Text>
                    </View>
                    </View>
                    <TouchableOpacity 
                        style={{
                            backgroundColor: 'black',
                            padding: 15,
                            borderRadius: 5,
                            width: "100%",
                            alignItems:"center",
                            justifyContent:"center",
                            marginTop: 30,
                            marginBottom:30,
                            borderColor:"#FF99FF",
                            borderWidth:2
                        }}
                        onPress={toggleCameraOverlay}>
                        <Text style={{color:"white"}}>Take picture</Text>
                    </TouchableOpacity>

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
    </View>
    )
}


export const AlreadyUploadedSpots = ({
    currentSlugMemory,
    highlighted,
    setHighlighted,
    scrollViewRef,
    setIsModalUp,
    isModalUp,
    setMoleToDeleteId
}) => {
    return(
        <>
        {currentSlugMemory.length != 0 ? <View style={{width:"100%",borderWidth:0.4,marginBottom:10,opacity:0.2}} />:null}
        {currentSlugMemory.length != 0 &&
            currentSlugMemory.map((data,index) => (
                <View key={index}>
                    <View style={[{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"300",borderWidth:0.8,borderColor:"lightgray",padding:10,marginTop:10,borderRadius:20},highlighted == data.id && {position:"absolute",top:-460,backgroundColor:"white",zIndex:100,left:-150}]}>
                        <Image
                            source={{uri: data.picture }}
                            style={{width:75,height:75,borderWidth:1,borderRadius:10,}}
                        />
                        <Text>{data.id}</Text>
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <MaterialCommunityIcons
                                name="eye"
                                size={25}
                                color={highlighted == data.id ? "red" : "black"}
                                style={{padding:2}}
                                onPress={() => {if (data.id == highlighted){setHighlighted("");}else{setHighlighted(data.id);} scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });}}
                            />
                            <TouchableOpacity onPress={() => {setIsModalUp(!isModalUp);setMoleToDeleteId(data.id)}} >
                                <MaterialCommunityIcons
                                    name="delete"
                                    size={30}
                                    color="red"
                                    style={{padding:2,marginLeft:10}}
                                    opacity="0.6"                                                         
                                />
                            </TouchableOpacity>                                       
                        </View>
                    </View>
                </View>
            ))
            
        }
        </>
    )
}


export const UploadButtons = ({
    uploadedSpotPicture,
    redDotLocation,
    handleMarkeAsComplete,
    handleMoreBirthmark,
    markedAsComplete
}) => {
    return(
        <View style={{width:"100%",alignItems:"center",marginBottom:10,marginTop:30}}>

        <Pressable onPress={handleMoreBirthmark} style={redDotLocation.x != -100 && uploadedSpotPicture != null ? spotUpload_2_styles.MoreSpotButton : {opacity:0.3,backgroundColor:"black",borderRadius:10,marginBottom:15,marginTop:20,width:"80%",alignItems:"center",borderWidth:1,borderColor:"#FF99FF"}}>
            <Text style={{padding:15,color:"white",fontWeight:"700"}}>Upload</Text>
        </Pressable>

        {redDotLocation.x != -100 && uploadedSpotPicture != null ? (
            <Text style={{color:"green",fontWeight:"300",fontSize:10,marginBottom:20}}>2/2 - All Steps Completed</Text> 
        ):(
            <Text style={{fontWeight:"800",opacity:0.5,fontSize:10,marginBottom:20,color:"red"}}>Not All Steps Completed</Text>
        )}
    
        <View style={{width:"100%",borderWidth:0.5,marginBottom:20}} />
        {markedAsComplete ?
            <Pressable onPress={() => handleMarkeAsComplete("add")} style={spotUpload_2_styles.AllSpotButton}>
                <Text style={{padding:15,color:"white",fontWeight:"700"}}>All moles uploaded on the slug</Text>
            </Pressable>
            :
            <Pressable onPress={() => handleMarkeAsComplete("remove")} style={spotUpload_2_styles.RallSpotButton}>
                <Text style={{padding:15,color:"white",fontWeight:"700"}}>Remove the complete mark</Text>
            </Pressable>
        }
    </View>
    )
}