import { View,Text,TouchableOpacity,StyleSheet,ScrollView,RefreshControl,Dimensions ,TextInput,Linking,ActivityIndicator, Modal} from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import React,{useState,useEffect,useRef,useCallback} from "react";
import "react-native-gesture-handler"
import { useAuth } from "../../../context/UserAuthContext";
import moment from 'moment'
import {app} from "../../../services/firebase"
import { getFunctions, httpsCallable } from "firebase/functions";
import { saveDiagnosisProgress } from "../../../services/server";
import { DiagnosisData } from "../../../utils/types";
import { OpenApiResponseType } from "../../Chat/diagnosisPage";



const DiagnosisCenter = ({navigation,route}) => {

//<==================<[ Variables ]>====================>

    const [diagnosisData, setDiagnosisData] = useState<DiagnosisData>(route.params.diagnosisData)
    const functions = getFunctions(app);
    const scrollRef = useRef(null)

    const { currentuser } = useAuth()

    const [refreshing, setRefreshing] = useState(false);
    const [ currentPageFeature, setCurrentPageFeature] = useState(0)
    //SHEET SHOW

    const snapPoints = ["100%"]
    const sheetRef = useRef(null)
    //H-SWIPE
    const { width } = Dimensions.get('window');
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false)


//<==================<[ Functions ]>====================>

    const handleBack = (permission) => {    
        navigation.goBack()   
    };
    
    const handleOpenSheet = (action) => {
        if(action == "open"){
            sheetRef.current.present()            
        } else if ( action == "close"){
            sheetRef.current.close()            
        } 
    };
    
    const handleScrollReminder = (e) => {
        const page = Math.round(e.nativeEvent.position);
        setCurrentPage(page);
    };
    
    useEffect(()=> {
    },[])
    
    function dateFormat(timestampRaw) {    
        if(timestampRaw == "Not provided yet"){
            return timestampRaw
        } else{
            const format = moment(timestampRaw).format('YYYY.MM.DD')
            return format;
        }    
    };
    
    const handleScroll = (e) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const pageWidth = width; 
        const currentPage = Math.floor((offsetX + pageWidth / 2) / pageWidth);
        setCurrentPageFeature(currentPage);
    };
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);  
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    }, []);
    
    const  generateDiagnosisFromPrompt = async (request) => {
        const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
        try {
            const result = await generateTextFunction({name: request}) as OpenApiResponseType;
            //SETT LOADING FALSE      
            return `${result.data.data.choices[0].message.content}`
        } catch (error) {
            console.error('Firebase function invocation failed:', error);
            return error
        }
    };  
    
    const ProcessYoutubeExplainVideo = async () => {   
        const type = "explain_video"   
        const wrongLink = diagnosisData.explain_video
        const prompt = `The video that explains: ${diagnosisData.diagnosis}, ${wrongLink} - Was not avalible. Can you please recommend another great youtube video that explains ${diagnosisData.diagnosis}. Your answer MUST be ONLY the https:// link to the video`
        const response = await generateDiagnosisFromPrompt(prompt)
        setDiagnosisData(prevState => ({
        ...prevState,
        [type]: response
        }));
        return response
    }
    
    const handleVideoRegenerate = async() => {
        setIsLoading(true)
        console.log("started")
        try{
            const res = await ProcessYoutubeExplainVideo()
            await saveDiagnosisProgress({
                userId:currentuser.uid,
                data: diagnosisData
            })
            setIsLoading(false)
        } catch(err) {
            console.log(err)
        }                 
    }


//<==================<[ Components ]>====================>

    const LoadingOverlay = () => {
        return(
            <View style={styles.loadingModal}>
            <Text style={{fontSize:20,marginBottom:20,fontWeight:"800",color:"black"}}>Reloading your data ...</Text>
            <ActivityIndicator size="large" color="black" />
        </View>
        )
    }


//<==================<[ Main Return ]>====================>

    return(        
    <>
        {isLoading ? 
        LoadingOverlay()
        :
        <ScrollView 
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['magenta']}
                    tintColor={'magenta'}
                />
            }
            ref={scrollRef}
            style={{width:"100%",height:"100%",backgroundColor:"black",flex:1}}
        >             
        <View style={styles.container}>            
            <View style={styles.ProgressBar}>
                <TouchableOpacity onPress={handleBack} style={{backgroundColor:"black",borderRadius:30,borderWidth:3,borderColor:"white"}}>
                    <MaterialCommunityIcons 
                        name="arrow-left"
                        size={25}
                        style={{padding:5}}
                        color={"white"}
                    />
                </TouchableOpacity>
                <Text style={{fontWeight:"800",opacity:1,color:"black"}}>{diagnosisData.id}</Text>
                <TouchableOpacity onPress={() => {scrollRef.current.scrollTo({x:0, y:550, animated:true})}} style={{backgroundColor:"black",borderRadius:30,borderWidth:3,borderColor:"white"}}>
                    <MaterialCommunityIcons 
                            name="folder"
                            size={25}
                            style={{padding:10}}
                            color={"white"}
                        />
                </TouchableOpacity>
            </View>
            
            <LinearGradient
                colors={['magenta', 'black']}
                locations={[0.2,1]}        
                style={{width:"100%",alignItems:"center"}}
            >
                <View style={styles.scoreCircle}>                     
                    <Text style={[{fontSize:50,fontWeight:"700"},{opacity:0.5}]}>{diagnosisData.diagnosis}</Text>                    
                </View>
                <View style={{width:"100%",flexDirection:"row",justifyContent:"space-between",padding:20,paddingBottom:100,marginTop:20,alignItems:"center"}}>
                    <View style={{marginTop:25}}>
                        <Text style={{fontWeight:"300",fontSize:13,color:"white"}}>Made in:</Text>
                        <Text style={{fontWeight:"500",opacity:0.5,color:"white"}}>{diagnosisData.created_at}</Text>
                    </View>
                    <View style={{maxWidth:"60%",alignItems:"center"}}>
                        <View style={{padding:10,backgroundColor:"rgba(0,0,0,0.8)",borderRadius:5,marginTop:5,opacity:0.6}}>    
                            <Text style={[{fontSize:12,fontWeight:"600"},{opacity:1,color:"white"}]}>Chance: <Text style={diagnosisData.stages.stage_two.chance.length > 4 ? {fontSize:20,color:"white"} : {fontSize:12,color:"white"}}>{diagnosisData.stages.stage_two.chance}</Text></Text> 
                        </View>
                        <View style={{padding:10,backgroundColor:"rgba(0,0,0,0.3)",borderRadius:5,marginTop:5}}>                        
                            <Text style={{fontWeight:"500",opacity:0.7,maxWidth:"100%",color:"white"}}>Recommended Revision : <Text style={{fontWeight:"800",color:"white"}}>{diagnosisData.stages.stage_two.assistance_frequency}</Text></Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>            
            <View style={{width:"100%",paddingTop:100,backgroundColor:"black",marginTop:24}}> 

                <ScrollView style={{marginTop:10,height:220,top:-80,position:"absolute",zIndex:-10,width:"100%"}} onScroll={(e) =>  handleScroll(e)} horizontal showsHorizontalScrollIndicator={false}>    
                    <View key={1} style={{width:width,flexDirection:"row",justifyContent:"space-evenly"}}>
                    <View style={styles.dataBox2}>
                            <Text style={{fontWeight:"400",opacity:0.4,marginBottom:5,fontSize:11,color:"white"}}>Get educated</Text>
                            <Text style={{fontWeight:"700",opacity:0.7,marginBottom:10,fontSize:16,color:"white"}}>What is {diagnosisData.diagnosis}</Text>       
                            <View style={{alignItems:"center",flexDirection:"row",justifyContent:"space-between",marginBottom:10}}>                                
                                <MaterialCommunityIcons 
                                    name="youtube"
                                    size={20}
                                    style={{opacity:0.3}}
                                    color={"white"}
                                />
                                <Text style={{fontWeight:"600",opacity:0.3,marginLeft:10,color:"white"}}>Youtube</Text>                     
                            </View>                     
                            <TouchableOpacity  onPress={() => Linking.openURL(diagnosisData.explain_video)} style={{borderWidth:0.3,width:"100%",padding:10,paddingVertical:15,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row",backgroundColor:"black"}}>
                                <Text style={{fontWeight:"700",color:"white",marginRight:15,fontSize:13,opacity:0.8}}>Watch</Text>
                                <MaterialCommunityIcons 
                                    name='arrow-right'
                                    size={15}
                                    color={"magenta"}                                                                        
                                />
                            </TouchableOpacity>    
                            <TouchableOpacity  onPress={() => handleVideoRegenerate()} style={{opacity:0.5,borderWidth:0.3,width:"100%",backgroundColor:"white",padding:10,paddingVertical:6,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row",marginTop:10}}>
                                <Text style={{fontWeight:"500",color:"black",marginRight:15,fontSize:10,opacity:0.8}}>Not Avalible - Regenerate</Text>
                                <MaterialCommunityIcons 
                                    name='reload'
                                    size={15}
                                    color={"magenta"}                                                                        
                                />
                            </TouchableOpacity>      
                        </View>            
                    </View> 
                
                    <View key={2} style={{width:width,flexDirection:"row",justifyContent:"space-evenly"}}>
                        <View style={styles.dataBox}>
                            <Text style={{fontWeight:"400",opacity:0.4,marginBottom:5,fontSize:10,color:"white"}}>Data analasis</Text>
                            <Text style={{fontWeight:"700",opacity:0.7,marginBottom:10,color:"white",fontSize:12}}>Get insight</Text>       
                            <View style={{width:"80%",alignItems:"center",flexDirection:"row",justifyContent:"space-between",marginBottom:10}}>
                                <MaterialCommunityIcons 
                                    name="pencil"
                                    size={20}
                                    style={{opacity:0.3}}
                                    color={"white"}
                                />
                                <MaterialCommunityIcons 
                                    name="delete"
                                    size={20}
                                    style={{opacity:0.3}}
                                    color={"white"}
                                />  
                                <MaterialCommunityIcons 
                                    name="eye"
                                    size={20}
                                    style={{opacity:0.3}}
                                    color={"white"}
                                />  
                            </View>                     
                            <TouchableOpacity  style={{borderWidth:0.3,width:"100%",backgroundColor:"rgba(255,255,255,0.6)",padding:10,paddingVertical:10,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"black",marginRight:15,fontSize:13}}>Open</Text>
                                <MaterialCommunityIcons 
                                    name='arrow-right'
                                    size={15}
                                    color={"magenta"}                                                                        
                                />
                            </TouchableOpacity>     
                        </View>

                        <View style={styles.dataBox}>
                            <Text style={{fontWeight:"400",opacity:0.4,marginBottom:5,fontSize:10,color:"white"}}>Based on your results</Text>
                            <Text style={{fontWeight:"700",opacity:0.7,marginBottom:10,color:"white",fontSize:12}}>How to improove ?</Text>       
                            <View style={{width:"50%",alignItems:"center",flexDirection:"row",justifyContent:"space-between",marginBottom:10}}>
                                <MaterialCommunityIcons 
                                    name="folder-eye-outline"
                                    size={20}
                                    color={"white"}
                                    style={{opacity:0.3}}
                                />
                                <MaterialCommunityIcons 
                                    name="google-analytics"
                                    size={20}
                                    style={{opacity:0.3}}
                                    color={"white"}
                                />                       
                            </View>                     
                            <TouchableOpacity  style={{borderWidth:0.3,width:"100%",backgroundColor:"rgba(255,255,255,0.6)",padding:10,paddingVertical:10,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"black",marginRight:15,fontSize:13}}>Open</Text>
                                <MaterialCommunityIcons 
                                    name='arrow-right'
                                    size={15}
                                    color={"magenta"}                                                                        
                                />
                            </TouchableOpacity>     
                        </View>
                    </View>                  
                </ScrollView>                                                  
                <View style={styles.IndicatorContainer}>               
                    <View style={[styles.Indicator, { opacity: currentPageFeature === 0 ? 1 : 0.3 }]} />                     
                    <View style={[styles.Indicator, { opacity: currentPageFeature === 1 ? 1 : 0.3 }]} />                                           
                </View>                                         
            </View>
            <View style={styles.selectBox}>
                <View style={styles.boxTop}>
                    <Text style={{fontWeight:"700",fontSize:20,opacity:0.9,color:"white"}}>Most likely hypothesis</Text>
                </View>
                <View style={styles.boxBottom}>
                    <TouchableOpacity style={{width:"100%",alignItems:"center",borderWidth:1,padding:10,borderRadius:5,backgroundColor:"rgba(255,255,255,0.1)",borderColor:"white"}}>
                        <Text style={{color:"white",fontWeight:"700"}}>Open</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.selectBox}>
                <View style={styles.boxTop}>
                    <Text style={{fontWeight:"700",fontSize:20,opacity:0.9,color:"white"}}>Chance evaluation</Text>
                </View>
                <View style={styles.boxBottom}>
                    <TouchableOpacity style={{width:"100%",alignItems:"center",borderWidth:1,padding:10,borderRadius:5,backgroundColor:"rgba(255,255,255,0.1)",borderColor:"white"}}>
                        <Text style={{color:"white",fontWeight:"700"}}>Open</Text>
                    </TouchableOpacity>
                </View>
            </View>

                <View style={[{marginTop:30,width:"100%",alignItems:"center",zIndex:20,marginBottom:50,borderTopWidth:1,paddingTop:30}]}>
                    <TouchableOpacity style={{width:"80%",backgroundColor:"black",borderColor:"magenta",borderWidth:2,padding:20,marginTop:0,alignItems:"center",borderRadius:100}}>
                        <Text style={{color:"white",fontWeight:"800"}}>Delete</Text>
                    </TouchableOpacity>
                </View>
        </View>             
        </ScrollView>
        }
        <Modal visible={true} animationType="slide" presentationStyle="formSheet" >
            <View style={{backgroundColor:"black",width:"100%",height:"100%"}}>
            <TouchableOpacity onPress={() => {}} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.86)",borderWidth:2,borderColor:"gray",paddingVertical:10,borderRadius:10,width:"100%",alignSelf:"center",borderBottomLeftRadius:0,borderBottomRightRadius:0}}>
                <MaterialCommunityIcons 
                    name='close'
                    size={25}
                    color={"white"}
                />
                <Text style={{color:"white",fontWeight:"800",fontSize:16,marginLeft:10,marginRight:10}}>Close</Text>
            </TouchableOpacity>
            <Stage_1 fullDiagnosis={diagnosisData.stages.stage_one} />
            </View>
        </Modal>
    </>
    );
}

const Stage_1 = ({fullDiagnosis}) => {
    return(
        <ScrollView style={{width:"100%",height:"100%"}} showsVerticalScrollIndicator={false}>
        <View style={Dstyles.diagnosisPage}>

            <View style={{width:"100%",backgroundColor:"white",marginBottom:0,borderBottomWidth:5,padding:30,}}>
            <Text style={{color:"back",fontSize:20,fontWeight:"800"}}>{fullDiagnosis.diagnosis}</Text>
            <View style={{marginTop:10,borderLeftWidth:2,borderColor:"black"}}>
                <Text style={{color:"back",fontSize:12,fontWeight:"500",textAlign:"justify",paddingLeft:10}}>{fullDiagnosis.description}</Text>
            </View>
            </View>              
            <View style={{width:"100%",marginTop:0,borderWidth:0,paddingBottom:30,alignItems:"center"}}>
            <Text  style={{color:"back",fontWeight:"800",marginBottom:10,fontSize:17,padding:20}}>Common symphtoms of {fullDiagnosis.diagnosis}</Text>
            <ScrollView horizontal style={{width:"100%"}} showsHorizontalScrollIndicator={false} >
            {fullDiagnosis.symphtoms.map((data)=>(
                <View style={{width:200,alignItems:"center",borderRightWidth:0,justifyContent:"center",marginLeft:20,marginTop:0}}>
                <Text style={{paddingVertical:10,borderWidth:1,paddingHorizontal:15,borderRadius:20,fontWeight:"800",borderColor:"magenta",opacity:0.5}}>{data.numbering}</Text>
                <Text style={{padding:0,fontWeight:"600",marginTop:20,textAlign:"center"}}>{data.content}</Text>
                </View>
            ))}
            </ScrollView>
            </View>     

            <View style={{width:"100%",marginTop:2,borderTopWidth:3,paddingBottom:30,alignItems:"center",borderBottomWidth:0.3}}>
            <Text  style={{color:"back",fontWeight:"800",marginBottom:10,fontSize:17,padding:20}}>Common symphtoms of {fullDiagnosis.diagnosis}</Text>
            <ScrollView horizontal style={{width:"100%"}} showsHorizontalScrollIndicator={false} >
            {fullDiagnosis.symphtoms.map((data)=>(
                <View style={{width:200,alignItems:"center",borderRightWidth:0,justifyContent:"center",marginLeft:20,marginTop:0}}>
                <Text style={{paddingVertical:10,borderWidth:1,paddingHorizontal:15,borderRadius:20,fontWeight:"800",borderColor:"magenta",opacity:0.5}}>{data.numbering}</Text>
                <Text style={{padding:0,fontWeight:"600",marginTop:20,textAlign:"center"}}>{data.content}</Text>
                </View>
            ))}
            </ScrollView>
            </View>    
        </View>
        </ScrollView>
    )
}


//<==================<[ Style Sheet ]>====================>

const styles = StyleSheet.create({
    ProgressBar:{
        width:"100%",
        alignItems:"center",
        borderWidth:0,
        padding:10,
        backgroundColor:"transparent",
        flexDirection:"row",
        justifyContent:"space-between",
        position:"absolute",
        top:50,
        zIndex:5   
    },
    loadingModal:{
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor: "rgba(0, 0, 0, 0)",
        paddingBottom:10
    },
    scoreCircle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth:0,
        borderRadius: 30,
        width: "100%",
        height: 150,
        borderLeftColor:"gray",   
        borderRightColor:"gray",      
        borderTopColor:"black", 
        borderBottomColor:"gray",
        marginTop:110      
    },
    container:{
        flex:1,
        width: "100%",        
        alignItems: "center",
        height:"100%",
        flexDirection: "column",
        backgroundColor:"black"
    },
    dataBox:{
        width:150,
        height:150,
        borderWidth:2,
        borderRadius:20,
        padding:10,    
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(255,0,255,0.25)",
        borderColor:"magenta",    
    },
    dataBox2:{
        width:300,
        height:190,
        borderWidth:2,
        borderRadius:15,
        padding:10,   
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        opacity:0.98,
        backgroundColor:"rgba(255,0,255,0.25)",
        borderColor:"magenta",    
    },
    selectBox:{
        width:"90%",
        borderWidth:2,
        alignItems:"center",
        marginRight:"auto",
        marginLeft:"auto",
        padding:20,
        borderRadius:10,
        marginBottom:0,
        marginTop:50,
        backgroundColor:"rgba(250,0,250,0.2)",
        borderColor:"magenta"
    },
    boxTop:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:"100%",        
    },
    boxBottom:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:"100%",
        padding:5,
        alignItems:"center",        
        marginTop:20
    },
    IndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',        
        backgroundColor:"rgba(255,255,255,0.8)",
        padding:15,    
        borderRadius:50,       
        zIndex:30,
        marginBottom:10,
        marginTop:30,
        width:"80%",
        marginRight:"auto",
        marginLeft:"auto",        
    },
    Indicator: {
        width: 6,
        height: 6,
        backgroundColor: 'black',
        borderRadius: 3,
        marginHorizontal: 5,
    },
})

const Dstyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:0,
        width:'100%',
        alignItems:'center',
        position:"relative",
        height:"100%",
        justifyContent:"center"
    },
    diagnosisPage:{
        alignItems:"center",
        width:"100%",
        height:"100%",
        paddingBottom:40,
    }
});


export default DiagnosisCenter