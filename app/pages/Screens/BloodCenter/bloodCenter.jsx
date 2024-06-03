import { View,Text,TouchableOpacity,StyleSheet,ScrollView,RefreshControl,Dimensions ,TextInput} from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import React,{useState,useEffect,useRef,useCallback} from "react";
import "react-native-gesture-handler"
import { useAuth } from "../../../context/UserAuthContext";
import { fetchBloodWork,fetchBloodWorkHistory } from "../../../server"
import moment from 'moment'
import PagerView from 'react-native-pager-view';

const BloodCenter = ({navigation}) => {

    //<==================<[ Variables ]>====================>
    
    const scrollRef = useRef(null)

    const { currentuser } = useAuth()

    const [refreshing, setRefreshing] = useState(false);
    const [ currentPageFeature, setCurrentPageFeature] = useState(0)
    //SHEET SHOW
    const [bloodSelected, setBloodSelected] = useState(
        {data:[],created_at:"Sun Aug 05 2001 01:15:00 GMT+0200"}
    )
    const snapPoints = ["100%"]
    const sheetRef = useRef(null)
    //H-SWIPE
    const { width } = Dimensions.get('window');
    const [currentPage, setCurrentPage] = useState(0);
    const [ bottomSheetSelected, setBottomSheetSelected ] = useState("")
    //Latest & History BW-DATA
    const [bloodWorkHistoryData, setBloodWorkHistoryData] = useState([])
    const [latestBloodWork, setLatestBloodWork] = useState({
        created_at: "Not provided yet",
    })

    //<==================<[ Functions ]>====================>

    const handleBack = (permission) => {    
        navigation.goBack()   
    };

    const handleOpenSheet = (action) => {
        if(action == "open"){
            sheetRef.current.present()            
        } else if ( action == "close"){
            sheetRef.current.close()
            setBloodSelected({data:[],created_at:""})
        } 
    };

    const fetchLatestBloodWork = async () => {
        const response = await fetchBloodWork({
            userId: currentuser.uid,            
        })

        if (response != false && response != "NoBloodWork"){
            setLatestBloodWork(response)
            setBloodSelected(response)
        } else if ( response == false) {
            alert("Something went wrong ....")
        } else if (response == "NoBloodWork"){
            setLatestBloodWork({ created_at: "Not provided yet"})
        }
    };

    const fetchAllBloodWorkHistory = async () => {
        const response = await fetchBloodWorkHistory({
            userId: currentuser.uid,            
        })

        if (response != false && response != "NoHistory"){
            setBloodWorkHistoryData(response)
        } else if (response == false) {
            alert("Something went wrong ....")
        } else if (response == "NoHistory"){
            setBloodWorkHistoryData([])
        }
    };

    const handleScrollReminder = (e) => {
        const page = Math.round(e.nativeEvent.position);
        setCurrentPage(page);
    };

    useEffect(()=> {
        fetchLatestBloodWork()
        fetchAllBloodWorkHistory()
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
        fetchLatestBloodWork()
        fetchAllBloodWorkHistory()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    }, []);


    //<==================<[ Components ]>====================>

    function SingleBloodAnalasis(){
        return( 
            <ScrollView style={{width:"100%"}}>                    
                <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
                    <View style={[styles.IndicatorContainer]}>
                        {bloodSelected.data.map((data,index) => (
                            <View style={[styles.Indicator, { opacity: currentPage === index ? 1 : 0.3 }]} />      
                        ))
                        }                                                                        
                    </View>  
                    <PagerView style={{marginTop:0,width:"100%",height:2000}} onPageScroll={(e) => handleScrollReminder(e)} initialPage={0}>
                    {bloodSelected.data.map((dataFrom,index) =>(
                        <View key={index + 1} style={{width:"100%",alignItems:"center",borderBottomWidth:2,borderTopWidth:0,backgroundColor:"rgba(0,0,0,0)"}}>                    
                            <View style={{width:"100%",alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",justifyContent:"center",padding:15,borderRadius:0,marginTop:0,borderBottomWidth:0.5,marginTop:-15}}>
                                <Text style={{fontWeight:"700",fontSize:"18",width:"100%",textAlign:"center"}}>{dataFrom.title}</Text>            
                            </View>                             
                            <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
                                {dataFrom.data.map((dataFrom2) =>(
                                    <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginTop:0,borderBottomWidth:0.5,padding:20,borderRadius:20,backgroundColor:"white"}}>
                                        <Text style={{fontWeight:"600",width:"70%"}}>{dataFrom2.type}</Text>
                                        <View style={{borderLeftWidth:2}}>        
                                            <TextInput 
                                                keyboardType="numeric"
                                                style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10,marginLeft:20}}                   
                                                value={`${dataFrom2.number}`}                                                                                        
                                                textAlign="center"                                                       
                                            />                   
                                        </View> 
                                    </View>
                                ))
                                    
                                }       
                            </View>                            
                        </View>   
                    ))}          
                              <View style={{width:"100%",alignItems:"center",flexDirection:"row",marginRight:"auto",marginLeft:"auto"}}>
                            <View style={{height:40,borderWidth:0,alignItems:"center",justifyContent:"space-between",width:"85%",flexDirection:"row",alignItems:"center",marginRight:"auto",marginLeft:"auto"}}>
                                <TouchableOpacity style={{width:150,borderWidth:2,flexDirection:"row",alignItems:"center",padding:0,borderRadius:10,marginTop:0}}>
                                    <View style={{padding:5,borderRightWidth:2,borderLeftWidth:0,borderTopWidth:0,borderBottomWidth:0, borderRadius:0}}>
                                        <MaterialCommunityIcons
                                            name="pencil"
                                            size={25}
                                        />   
                                    </View>                    
                                    <Text style={{fontWeight:"700",marginLeft:10,fontSize:15}}>Edit Data</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{width:150,borderWidth:2,flexDirection:"row",alignItems:"center",padding:0,borderRadius:10,marginTop:0,backgroundColor:"#ff4d4a",opacity:0.5}}>
                                    <View style={{padding:5,borderRightWidth:2,borderLeftWidth:0,borderTopWidth:0,borderBottomWidth:0}}>
                                        <MaterialCommunityIcons 
                                            name="delete"
                                            size={25}
                                        />   
                                    </View>                    
                                    <Text style={{fontWeight:"700",marginLeft:10,fontSize:15}}>Delete</Text>
                                </TouchableOpacity>
                            </View>         
                    </View>                                      
                    </PagerView>       
                </View>                       
            </ScrollView>          
        )
    };

    function SingleBloodAnalasisPage(){
        return( 
        <ScrollView>
            <View style={{height:"100%",justifyContent:"space-between",width:"100%",alignItems:"center"}}>
        
                <View style={{width:"100%",height:"95%",alignItems:"center",marginBottom:30}}>
                    <PagerView style={{marginTop:0,width:"100%",height:"85%"}} onPageScroll={(e) => handleScrollReminder(e)} initialPage={0}>
                    {bloodSelected.data.map((dataFrom,index) =>(
                        <View key={index + 1} style={{width:"100%",alignItems:"center",height:"100%",borderBottomWidth:2,borderTopWidth:0.5,backgroundColor:"rgba(0,0,0,0)"}}>                    
                            <View style={{width:"100%",alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",justifyContent:"center",padding:15,borderRadius:0,marginTop:0,borderBottomWidth:0.5}}>
                                <Text style={{fontWeight:"700",fontSize:"18",width:"100%",textAlign:"center"}}>{dataFrom.title}</Text>            
                            </View> 
                            <ScrollView style={{width:"100%",marginTop:10}}>
                            <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
                                {dataFrom.data.map((dataFrom2) =>(
                                    <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginTop:0,borderBottomWidth:0.5,padding:20,borderRadius:20,backgroundColor:"white"}}>
                                        <Text style={{fontWeight:"600",width:"70%"}}>{dataFrom2.type}</Text>
                                        <View style={{borderLeftWidth:2}}>        
                                            <TextInput 
                                                keyboardType="numeric"
                                                style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10,marginLeft:20}}                   
                                                value={`${dataFrom2.number}`}                                                                                        
                                                textAlign="center"                                                       
                                            />                   
                                        </View> 
                                    </View>
                                ))
                                    
                                }       
                            </View>
                            </ScrollView>
                        </View>   
                    ))}                             
                    </PagerView>
                    <View style={[styles.IndicatorContainer]}>
                        {bloodSelected.data.map((data,index) => (
                            <View style={[styles.Indicator, { opacity: currentPage === index ? 1 : 0.3 }]} />      
                        ))
                        }                                                                        
                    </View>  
                    <View style={{width:"100%",alignItems:"center",flexDirection:"row",marginRight:"auto",marginLeft:"auto",height:"8%"}}>
                    <View style={{height:150,borderWidth:0,alignItems:"center",justifyContent:"space-between",width:"85%",flexDirection:"row",alignItems:"center",marginRight:"auto",marginLeft:"auto"}}>
                        <TouchableOpacity style={{width:150,borderWidth:2,flexDirection:"row",alignItems:"center",padding:0,borderRadius:10,marginTop:0}}>
                            <View style={{padding:5,borderRightWidth:2,borderLeftWidth:0,borderTopWidth:0,borderBottomWidth:0, borderRadius:0}}>
                                <MaterialCommunityIcons
                                    name="pencil"
                                    size={25}
                                />   
                            </View>                    
                            <Text style={{fontWeight:"700",marginLeft:10,fontSize:15}}>Edit Data</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{width:150,borderWidth:2,flexDirection:"row",alignItems:"center",padding:0,borderRadius:10,marginTop:0,backgroundColor:"#ff4d4a",opacity:0.5}}>
                            <View style={{padding:5,borderRightWidth:2,borderLeftWidth:0,borderTopWidth:0,borderBottomWidth:0}}>
                                <MaterialCommunityIcons 
                                    name="delete"
                                    size={25}
                                />   
                            </View>                    
                            <Text style={{fontWeight:"700",marginLeft:10,fontSize:15}}>Delete</Text>
                        </TouchableOpacity>
                    </View>         
                    </View>
                </View>                       
            </View>    
        </ScrollView>           
        )
    };


    //<==================<[ Main Return ]>====================>
    
    return(
        <GestureHandlerRootView style={{flex:1}}>
        <BottomSheetModalProvider>
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
        style={{width:"100%",height:"100%",backgroundColor:"white",flex:1}}>
        <View style={styles.container}>            
            <View style={styles.ProgressBar}>
                <TouchableOpacity onPress={handleBack} style={{backgroundColor:"white",borderRadius:30}}>
                    <MaterialCommunityIcons 
                        name="arrow-left"
                        size={25}
                        style={{padding:5}}
                    />
                </TouchableOpacity>
                <Text style={{fontWeight:"700"}}>Latest: <Text style={{fontWeight:"400",opacity:0.8}}>{dateFormat(bloodSelected.created_at)}</Text></Text>
                <TouchableOpacity onPress={() => {handleOpenSheet("open");setBloodSelected(latestBloodWork)}} style={{backgroundColor:"white",borderRadius:30}}>
                    <MaterialCommunityIcons 
                        name="water"
                        size={30}
                        style={{padding:5}}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {scrollRef.current.scrollTo({x:0, y:600, animated:true})}} style={{backgroundColor:"white",borderRadius:30,position:"absolute",right:10,bottom:-50}}>
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
                    <Text style={[{fontSize:50,fontWeight:'bold'},{opacity:0.5}]}>17%</Text>
                    <Text style={[{fontSize:15,fontWeight:700},{opacity:0.8}]}>Accuracy</Text>
                </View>
                <View style={{width:"100%",flexDirection:"row",justifyContent:"space-between",padding:20,paddingBottom:100,marginTop:20}}>
                    <View>
                        <Text style={{fontWeight:"300",fontSize:13}}>Made in:</Text>
                        <Text style={{fontWeight:"500"}}>2003.11.17</Text>
                    </View>
                    <View style={{padding:10,backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10}}>
                        <Text style={{fontWeight:"500",opacity:0.7}}>Up to date for 30 days</Text>
                    </View>
                </View>    
            </LinearGradient>            
            <View style={{width:"100%",paddingTop:100,backgroundColor:"white"}}> 

                <ScrollView style={{marginTop:10,height:220,top:-80,position:"absolute",zIndex:-10,width:"100%"}} onScroll={(e) =>  handleScroll(e)} horizontal showsHorizontalScrollIndicator={false}>    
                    <View key={1} style={{width:width,flexDirection:"row",justifyContent:"space-evenly"}}>
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
                            <TouchableOpacity onPress={() => {handleOpenSheet("open");setBloodSelected(latestBloodWork)}} style={{borderWidth:0.3,width:"100%",backgroundColor:"white",padding:10,paddingVertical:10,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
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
                            <TouchableOpacity onPress={() => {handleOpenSheet("open");setBloodSelected(latestBloodWork)}} style={{borderWidth:0.3,width:"100%",backgroundColor:"white",padding:10,paddingVertical:10,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"black",marginRight:15,fontSize:13}}>Open</Text>
                                <MaterialCommunityIcons 
                                    name='arrow-right'
                                    size={15}
                                    color={"magenta"}                                                                        
                                />
                            </TouchableOpacity>     
                        </View>
                    </View>  
                    <View key={2} style={{width:width,flexDirection:"row",justifyContent:"space-evenly"}}>
                    <View style={styles.dataBox2}>
                            <Text style={{fontWeight:"400",opacity:0.4,marginBottom:5,fontSize:11}}>See, edit or delete your stored data</Text>
                            <Text style={{fontWeight:"700",opacity:0.7,marginBottom:10,fontSize:16}}>Open Blood Work</Text>       
                            <View style={{width:"70%",alignItems:"center",flexDirection:"row",justifyContent:"space-between",marginBottom:10}}>
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
                            <TouchableOpacity onPress={() => {handleOpenSheet("open");setBloodSelected(latestBloodWork);setBottomSheetSelected("open")}} style={{borderWidth:0.3,width:"100%",backgroundColor:"white",padding:10,paddingVertical:10,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
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
                    <Text style={{fontSize:12,fontWeight:"400",opacity:0.4}}>Latest to oldest !</Text>
                    <Text style={{fontSize:20,fontWeight:"700",opacity:0.8}}>All Blood Works</Text>
                </View>
                {latestBloodWork.created_at != "Not provided yet" ?
                    <View style={[styles.selectBox,{marginTop:20},latestBloodWork == bloodSelected &&{borderColor:"magenta",borderWidth:2} ]}>
                    <Text style={{position:"absolute",top:-20,opacity:0.3,fontWeight:"700",right:15,fontSize:12}}>Latest</Text>
                    {latestBloodWork == bloodSelected && <Text style={{position:"absolute",top:-20,opacity:0.5,fontWeight:"700",left:15,fontSize:12,color:"magenta"}}>Selected</Text>}
                        <View style={styles.boxTop}>
                            <View style={{flexDirection:"row"}}>
                                <MaterialCommunityIcons 
                                    name='water'
                                    size={30}
                                />
                                <View style={{marginLeft:20}}>
                                    <Text style={{fontSize:10,fontWeight:"600",opacity:0.5}}>Taken at:</Text>
                                    <Text style={{fontWeight:"800",fontSize:16}}>{dateFormat(latestBloodWork.created_at)}</Text>                                    
                                </View>
                            </View>    
                        </View>
                        <View style={styles.boxBottom}>                 
                            {latestBloodWork == bloodSelected ?
                            <TouchableOpacity onPress={() => {handleOpenSheet("open");setBloodSelected(latestBloodWork)}} style={{width:"100%",backgroundColor:"black",padding:10,paddingVertical:12,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:14}}>Open</Text>
                                <MaterialCommunityIcons 
                                    name='arrow-right'
                                    size={15}
                                    color={"magenta"}                                                                        
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => {setBloodSelected(latestBloodWork);scrollRef.current.scrollTo({x:0,y:0,animated:true})}} style={{width:"100%",backgroundColor:"black",padding:10,paddingVertical:12,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                            <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:14}}>Select</Text>
                            <MaterialCommunityIcons 
                                name='arrow-right'
                                size={15}
                                color={"magenta"}                                                                        
                            />
                        </TouchableOpacity>
                            }                          
                        </View>      
                    </View> 
                    :
                    <View style={{width:"80%",alignItems:"center",marginVertical:50,backgroundColor:"rgba(0,0,0,0.05)",marginRight:"auto",marginLeft:"auto",padding:20,borderRadius:20}}>
                        <Text style={{fontWeight:"700",fontSize:16,opacity:0.4}}>No blood work uploaded yet ...</Text>
                    </View> 
                }                                                 
                {bloodWorkHistoryData.map((data)=>(
                <View style={[styles.selectBox,{marginTop:0},data == bloodSelected &&{borderColor:"magenta",borderWidth:2} ]}>                
                {data == bloodSelected && <Text style={{position:"absolute",top:-20,opacity:0.5,fontWeight:"700",left:15,fontSize:12,color:"magenta"}}>Selected</Text>}
                    <View style={styles.boxTop}>
                        <View style={{flexDirection:"row"}}>
                            <MaterialCommunityIcons 
                                name='water'
                                size={30}
                            />
                            <View style={{marginLeft:20}}>
                                <Text style={{fontSize:10,fontWeight:"600",opacity:0.5}}>Taken at:</Text>
                                <Text style={{fontWeight:"800",fontSize:16}}>{dateFormat(data.created_at)}</Text>                                    
                            </View>
                        </View>    
                    </View>
                    <View style={styles.boxBottom}>                 
                        {data == bloodSelected ?
                        <TouchableOpacity onPress={() => {handleOpenSheet("open");setBloodSelected(data)}} style={{width:"100%",backgroundColor:"black",padding:10,paddingVertical:12,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                            <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:14}}>Open</Text>
                            <MaterialCommunityIcons 
                                name='arrow-right'
                                size={15}
                                color={"magenta"}                                                                        
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => {setBloodSelected(data);scrollRef.current.scrollTo({x:0,y:0,animated:true})}} style={{width:"100%",backgroundColor:"black",padding:10,paddingVertical:12,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                        <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:14}}>Select</Text>
                        <MaterialCommunityIcons 
                            name='arrow-right'
                            size={15}
                            color={"magenta"}                                                                        
                        />
                    </TouchableOpacity>
                        }                          
                    </View>      
                </View> 
                ))}                               
            </View>
            <View style={[{marginTop:30,width:"100%",alignItems:"center",zIndex:20,marginBottom:50,borderTopWidth:1,paddingTop:30}]}>
                        <TouchableOpacity onPress={() => navigation.navigate("Add_BloodWork",{type: latestBloodWork.created_at == "Not provided yet" ? "first" : "update"})} style={{width:"80%",backgroundColor:"black",borderColor:"magenta",borderWidth:2,padding:20,marginTop:0,alignItems:"center",borderRadius:100}}>
                            <Text style={{color:"white",fontWeight:"800"}}>{latestBloodWork.created_at == "Not provided yet" ? "Upload blood work" : "Update blood work"}</Text>
                        </TouchableOpacity>
                    </View>
        </View>
        </ScrollView>

                <BottomSheetModal
                        ref={sheetRef}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}                        
                        handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:30,color:"white"}}
                        handleIndicatorStyle={{backgroundColor:"white"}}                                              
                        handleComponent={() => 
                        <View style={{width:"100%",height:80,backgroundColor:"black",justifyContent:"center",alignItems:"center",borderRadius:0}}>
                            <View style={{borderWidth:1,borderColor:"white",width:30,marginTop:40}} />                                      
                                <MaterialCommunityIcons 
                                name='close'
                                color={"white"}
                                size={20}
                                style={{position:"absolute",right:30,padding:5,borderWidth:0.7,borderColor:"white",borderRadius:10,opacity:0.6,top:40}}
                                onPress={() => handleOpenSheet("close")}
                                />
                        </View>
                    }
                    >
                    {bottomSheetSelected == "open" && SingleBloodAnalasis()}
                    {bottomSheetSelected == "insight" && SingleBloodAnalasisPage()}
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
    scoreCircle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 13,
        borderRadius: 100,
        width: 200,
        height: 200,
        borderLeftColor:"gray",   
        borderRightColor:"gray",      
        borderTopColor:"black", 
        borderBottomColor:"gray",
        marginTop: 20,  
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
        height:150,
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
        padding:10,
        borderRadius:20,
        marginBottom:30,
        marginTop:20,
    },
    boxTop:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:"100%",  
        paddingTop:5      
    },
    boxBottom:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:"100%",
        padding:5,
        alignItems:"center",        
        marginTop:8
    },
    IndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',        
        backgroundColor:"rgba(0,0,0,0.1)",
        padding:10,    
        borderRadius:0,       
        zIndex:30,
        marginBottom:0,
        paddingTop:15,
        width:"100%",
        marginRight:"auto",
        marginLeft:"auto",        
    },
    Indicator: {
        width: 6,
        height: 6,
        backgroundColor: 'black',
        borderRadius: 3,
        marginHorizontal: 8,
    },
})

export default BloodCenter