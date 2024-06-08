import { View,Text,TouchableOpacity,StyleSheet,ScrollView,RefreshControl,Dimensions ,TextInput,Linking,ActivityIndicator} from "react-native"
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


const DiagnosisCenter = ({navigation,route}) => {

//<==================<[ Variables ]>====================>

    const [diagnosisData, setDiagnosisData] = useState(route.params.diagnosisData)
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
            const result = await generateTextFunction({name: request});
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
        <GestureHandlerRootView style={{flex:1}}>
            <BottomSheetModalProvider>
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
                    style={{width:"100%",height:"100%",backgroundColor:"white",flex:1}}
                >             
                <View style={styles.container}>            
                    <View style={styles.ProgressBar}>
                        <TouchableOpacity onPress={handleBack} style={{backgroundColor:"white",borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="arrow-left"
                                size={25}
                                style={{padding:5}}
                            />
                        </TouchableOpacity>
                        <Text style={{fontWeight:"700",opacity:0.8}}>{diagnosisData.id}</Text>
                        <TouchableOpacity style={{backgroundColor:"white",borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="water"
                                size={30}
                                style={{padding:5}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {scrollRef.current.scrollTo({x:0, y:550, animated:true})}} style={{backgroundColor:"white",borderRadius:30,position:"absolute",right:10,bottom:-50}}>
                            <MaterialCommunityIcons 
                                name="folder"
                                size={30}
                                style={{padding:5}}
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <LinearGradient
                        colors={['magenta', 'white']}
                        locations={[1,0.01]}        
                        style={{width:"100%",alignItems:"center"}}
                    >
                        <View style={styles.scoreCircle}>                     
                            <Text style={[{fontSize:50,fontWeight:'bold'},{opacity:0.5}]}>{diagnosisData.diagnosis}</Text>                    
                        </View>
                        <View style={{width:"100%",flexDirection:"row",justifyContent:"space-between",padding:20,paddingBottom:100,marginTop:20,alignItems:"center"}}>
                            <View style={{marginTop:25}}>
                                <Text style={{fontWeight:"300",fontSize:13}}>Made in:</Text>
                                <Text style={{fontWeight:"500",opacity:0.5}}>{diagnosisData.created_at}</Text>
                            </View>
                            <View style={{maxWidth:"60%",alignItems:"center"}}>
                                <Text style={[{fontSize:10,fontWeight:'bold'},{opacity:0.4,color:"#111"}]}>Current chance: <Text style={{fontSize:20,color:"black"}}>{diagnosisData.stages.stage_two.chance}</Text></Text> 
                                <View style={{padding:10,backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,marginTop:5}}>                        
                                    <Text style={{fontWeight:"500",opacity:0.7,maxWidth:"100%"}}>Next {diagnosisData.stages.stage_three.assistance_frequency} task: <Text style={{fontWeight:"700"}}>READY</Text></Text>
                                </View>
                            </View>                
                        </View>    
                    </LinearGradient>            
                    <View style={{width:"100%",paddingTop:100,backgroundColor:"white"}}> 

                        <ScrollView style={{marginTop:10,height:220,top:-80,position:"absolute",zIndex:-10,width:"100%"}} onScroll={(e) =>  handleScroll(e)} horizontal showsHorizontalScrollIndicator={false}>    
                            <View key={1} style={{width:width,flexDirection:"row",justifyContent:"space-evenly"}}>
                            <View style={styles.dataBox2}>
                                    <Text style={{fontWeight:"400",opacity:0.4,marginBottom:5,fontSize:11}}>Get educated</Text>
                                    <Text style={{fontWeight:"700",opacity:0.7,marginBottom:10,fontSize:16}}>What is {diagnosisData.diagnosis}</Text>       
                                    <View style={{alignItems:"center",flexDirection:"row",justifyContent:"space-between",marginBottom:10}}>                                
                                        <MaterialCommunityIcons 
                                            name="youtube"
                                            size={20}
                                            opacity={"0.3"}
                                        />
                                        <Text style={{fontWeight:"600",opacity:0.3,marginLeft:10}}>Youtube</Text>                     
                                    </View>                     
                                    <TouchableOpacity  onPress={() => Linking.openURL(diagnosisData.explain_video)} style={{borderWidth:0.3,width:"100%",backgroundColor:"white",padding:10,paddingVertical:15,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row",backgroundColor:"black"}}>
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
                                    <Text style={{fontWeight:"400",opacity:0.4,marginBottom:5,fontSize:10}}>Data analasis</Text>
                                    <Text style={{fontWeight:"700",opacity:0.7,marginBottom:10}}>Get insight</Text>       
                                    <View style={{width:"80%",alignItems:"center",flexDirection:"row",justifyContent:"space-between",marginBottom:10}}>
                                        <MaterialCommunityIcons 
                                            name="pencil"
                                            size={20}
                                            opacity={"0.3"}
                                        />
                                        <MaterialCommunityIcons 
                                            name="delete"
                                            size={20}
                                            opacity={"0.3"}
                                        />  
                                        <MaterialCommunityIcons 
                                            name="eye"
                                            size={20}
                                            opacity={"0.3"}
                                        />  
                                    </View>                     
                                    <TouchableOpacity  style={{borderWidth:0.3,width:"100%",backgroundColor:"white",padding:10,paddingVertical:10,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                        <Text style={{fontWeight:"600",color:"black",marginRight:15,fontSize:13}}>Open</Text>
                                        <MaterialCommunityIcons 
                                            name='arrow-right'
                                            size={15}
                                            color={"magenta"}                                                                        
                                        />
                                    </TouchableOpacity>     
                                </View>

                                <View style={styles.dataBox}>
                                    <Text style={{fontWeight:"400",opacity:0.4,marginBottom:5,fontSize:10}}>Based on your results</Text>
                                    <Text style={{fontWeight:"700",opacity:0.7,marginBottom:10}}>How to improove ?</Text>       
                                    <View style={{width:"50%",alignItems:"center",flexDirection:"row",justifyContent:"space-between",marginBottom:10}}>
                                        <MaterialCommunityIcons 
                                            name="folder-eye-outline"
                                            size={20}
                                            opacity={"0.3"}
                                        />
                                        <MaterialCommunityIcons 
                                            name="google-analytics"
                                            size={20}
                                            opacity={"0.3"}
                                        />                       
                                    </View>                     
                                    <TouchableOpacity  style={{borderWidth:0.3,width:"100%",backgroundColor:"white",padding:10,paddingVertical:10,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
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
                        <View style={{margin:20}}>
                            <Text style={{fontSize:12,fontWeight:"400",opacity:0.4}}>All your progress saved !</Text>
                            <Text style={{fontSize:20,fontWeight:"700",opacity:0.8}}>Stages</Text>
                        </View>                                             
                        <View style={styles.selectBox}>                           
                            <View style={styles.boxTop}>
                                <View style={{flexDirection:"row"}}>
                                    <MaterialCommunityIcons 
                                        name='doctor'
                                        size={30}
                                    />
                                    <View style={{marginLeft:20}}>
                                        <Text style={{fontWeight:"800",fontSize:16}}>Hypothesis - Stage 1</Text>
                                        <Text style={{fontWeight:"400",fontSize:10,maxWidth:"85%",opacity:0.5,marginTop:5}}>COMPLETED</Text>
                                    </View>
                                </View>    
                                <MaterialCommunityIcons 
                                    name='bell'
                                    size={20}
                                />
                            </View>
                            <View style={styles.boxBottom}>
                                <View style={{padding:1,width:"55%",marginRight:10,opacity:0.6, borderLeftWidth:0.3,paddingLeft:10,borderColor:"magenta"}}>
                                    <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Eliminating deficiencies</Text>
                                    <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Outline </Text>
                                    <Text style={{color:"black",fontSize:12,fontWeight:"300"}}>Outdated Moles: {"0"}</Text>
                                </View>
                    
                                    <TouchableOpacity onPress={() => {scrollRef.current.scrollTo({x:0,y:0,animated:true})}} style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                    <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:15}}>Meta Data</Text>
                                    <MaterialCommunityIcons 
                                        name='arrow-right'
                                        size={15}
                                        color={"magenta"}                                                                        
                                    />
                                </TouchableOpacity>                                         
                            </View>  
                        </View>

                        <View style={styles.selectBox}>                           
                            <View style={styles.boxTop}>
                                <View style={{flexDirection:"row"}}>
                                    <MaterialCommunityIcons 
                                        name='doctor'
                                        size={30}
                                    />
                                    <View style={{marginLeft:20}}>
                                        <Text style={{fontWeight:"800",fontSize:16,maxWidth:"90%"}}>Chance Evaluation - Stage 2</Text>
                                        <Text style={{fontWeight:"400",fontSize:10,maxWidth:"85%",opacity:0.5,marginTop:5}}>COMPLETED</Text>
                                    </View>
                                </View>    
                                <MaterialCommunityIcons 
                                    name='bell'
                                    size={20}
                                />
                            </View>
                            <View style={styles.boxBottom}>
                                <View style={{padding:1,width:"55%",marginRight:10,opacity:0.6, borderLeftWidth:0.3,paddingLeft:10,borderColor:"magenta"}}>
                                    <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Eliminating deficiencies</Text>
                                    <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Outline </Text>
                                    <Text style={{color:"black",fontSize:12,fontWeight:"300"}}>Outdated Moles: {"0"}</Text>
                                </View>
                    
                                    <TouchableOpacity onPress={() => Linking.openURL("https://www.youtube.com/watch?v=6akhmBqAe2g")} style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                    <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:15}}>Meta Data</Text>
                                    <MaterialCommunityIcons 
                                        name='arrow-right'
                                        size={15}
                                        color={"magenta"}                                                                        
                                    />
                                </TouchableOpacity>                                         
                            </View>  
                        </View>  

                        <View style={styles.selectBox}>                           
                            <View style={styles.boxTop}>
                                <View style={{flexDirection:"row"}}>
                                    <MaterialCommunityIcons 
                                        name='doctor'
                                        size={30}
                                    />
                                    <View style={{marginLeft:20}}>
                                        <Text style={{fontWeight:"800",fontSize:16,maxWidth:"90%"}}>Sustained Sympthtoms Tests - Stage 3</Text>
                                        <Text style={{fontWeight:"400",fontSize:10,maxWidth:"85%",opacity:0.5,marginTop:5}}>COMPLETED</Text>
                                    </View>
                                </View>    
                                <MaterialCommunityIcons 
                                    name='bell'
                                    size={20}
                                />
                            </View>
                            <View style={styles.boxBottom}>
                                <View style={{padding:1,width:"55%",marginRight:10,opacity:0.6, borderLeftWidth:0.3,paddingLeft:10,borderColor:"magenta"}}>
                                    <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Eliminating deficiencies</Text>
                                    <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Outline </Text>
                                    <Text style={{color:"black",fontSize:12,fontWeight:"300"}}>Outdated Moles: {"0"}</Text>
                                </View>
                    
                                    <TouchableOpacity onPress={() => {scrollRef.current.scrollTo({x:0,y:0,animated:true})}} style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                    <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:15}}>Meta Data</Text>
                                    <MaterialCommunityIcons 
                                        name='arrow-right'
                                        size={15}
                                        color={"magenta"}                                                                        
                                    />
                                </TouchableOpacity>                                         
                            </View>  
                        </View>    

                        <View style={styles.selectBox}>                           
                            <View style={styles.boxTop}>
                                <View style={{flexDirection:"row"}}>
                                    <MaterialCommunityIcons 
                                        name='doctor'
                                        size={30}
                                    />
                                    <View style={{marginLeft:20}}>
                                        <Text style={{fontWeight:"800",fontSize:16}}>Solution - Stage 4</Text>
                                        <Text style={{fontWeight:"400",fontSize:10,maxWidth:"85%",opacity:0.5,marginTop:5}}>COMPLETED</Text>
                                    </View>
                                </View>    
                                <MaterialCommunityIcons 
                                    name='bell'
                                    size={20}
                                />
                            </View>
                            <View style={styles.boxBottom}>
                                <View style={{padding:1,width:"55%",marginRight:10,opacity:0.6, borderLeftWidth:0.3,paddingLeft:10,borderColor:"magenta"}}>
                                    <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Eliminating deficiencies</Text>
                                    <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Outline </Text>
                                    <Text style={{color:"black",fontSize:12,fontWeight:"300"}}>Outdated Moles: {"0"}</Text>
                                </View>
                    
                                    <TouchableOpacity onPress={() => {scrollRef.current.scrollTo({x:0,y:0,animated:true})}} style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                    <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:15}}>Meta Data</Text>
                                    <MaterialCommunityIcons 
                                        name='arrow-right'
                                        size={15}
                                        color={"magenta"}                                                                        
                                    />
                                </TouchableOpacity>                                         
                            </View>  
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
                <BottomSheetModal
                        ref={sheetRef}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}                        
                        handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30,color:"white"}}
                        handleIndicatorStyle={{backgroundColor:"white"}}                                              
                        handleComponent={() => 
                        <View style={{width:"100%",height:100,backgroundColor:"black",justifyContent:"center",alignItems:"center",borderRadius:0}}>
                            <View style={{borderWidth:1,borderColor:"white",width:30,marginTop:50}} />   
                                <Text style={{color:"white",opacity:0.5,fontWeight:"600",marginTop:8,fontSize:13}}>Swipe down to go back</Text>     
                                <MaterialCommunityIcons 
                                name='close'
                                color={"white"}
                                size={20}
                                style={{position:"absolute",right:30,padding:5,borderWidth:0.7,borderColor:"white",borderRadius:10,opacity:0.6,top:50}}
                                onPress={() => handleOpenSheet("close")}
                                />
                        </View>
                    }
                    >
                    <></>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView >   
    );
}


//<==================<[ Style Sheet ]>====================>

const styles = StyleSheet.create({
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
        marginTop: 0,  
        marginTop:110      
    },
    container:{
        flex:1,
        width: "100%",        
        alignItems: "center",
        height:"100%",
        flexDirection: "column",
    },
    dataBox:{
        width:150,
        height:150,
        borderWidth:0.3,
        borderRadius:20,
        backgroundColor:"white",
        padding:10,    
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
    },
    dataBox2:{
        width:300,
        height:190,
        borderWidth:0.3,
        borderRadius:20,
        padding:10,
        backgroundColor:"white",        
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        opacity:0.98
    },
    selectBox:{
        width:"90%",
        borderWidth:0.3,
        alignItems:"center",
        marginRight:"auto",
        marginLeft:"auto",
        padding:20,
        borderRadius:20,
        marginBottom:30,
        marginTop:20,
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
        backgroundColor:"rgba(0,0,0,0.1)",
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

export default DiagnosisCenter