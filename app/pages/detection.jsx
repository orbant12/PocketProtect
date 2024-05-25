
import { View, Text, Pressable, ScrollView,StyleSheet,TouchableOpacity,Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressBar from 'react-native-progress/Bar';
//BASICS

import React, {useEffect, useState, useRef} from 'react';

//CONTEXT
import { useAuth } from '../context/UserAuthContext';

import { fetchAllDiagnosis } from '../server';

const DetectionLibary = ({navigation}) => {

    //<********************VARIABLES************************>        
    const { currentuser } = useAuth();

    const [isSelected, setIsSelected ] = useState("Melanoma")    
    const [ diagnosisData, setDiagnosisData] = useState([])

//<********************FUNCTIONS************************>

const fetchDiagnosis = async () => {
    const response = await fetchAllDiagnosis({
        userId: currentuser.uid,
    })
    if(response != false){
        setDiagnosisData(response)
    } else if (response == false){
        alert("Something went wrong !")
    }
}

useEffect(() => {      
    fetchDiagnosis()
}, []);


//<=====> COMPONENTS <==========>

function HealthScore(){
    return(
        <ScrollView style={styles.container}>
        <View style={styles.personalScoreSection}>
            <View style={styles.scoreTitle}>
                <View style={styles.scoreTitleLeft}>
                    <Text style={styles.titleTag}>Artifical Inteligence</Text>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>Personal Score</Text>
                    <Text style={{fontSize:15}}>Your personal score is 0.0</Text>   
                </View>
                <MaterialCommunityIcons
                    name="information-outline"
                    size={30}
                    color="black"
                    style={{marginLeft:10}}
                />
            </View>
            <View style={styles.scoreCircle}>
                <Text style={{fontSize:50,fontWeight:'bold'}}>17</Text>
                <Text style={{fontSize:15,fontWeight:700}}>out of 100</Text>

            </View>

            <View style={styles.ResultsScoreSection}>
                <View style={styles.ResultsScoreTitleRow}>
                    <Text style={{fontSize:18,fontWeight:700}}>Results</Text>
                    <Pressable onPress={() => navigation.navigate("Assistant")}>
                        <Text style={{fontSize:13,fontWeight:500,opacity:0.7}}>My Data</Text>
                    </Pressable>
                </View>
                <ScrollView horizontal style={{paddingBottom:20}} >
                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>

                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>

                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>

                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>

                    <View style={styles.ResultBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.DetectionSection}>
                <View style={styles.ResultsScoreTitleRow}>
                <View style={styles.scoreTitle}>
                <View style={styles.scoreTitleLeft}>
                    <Text style={styles.titleTag}>Artifical Inteligence</Text>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>Diases Detection</Text>
                    <Text style={{fontSize:15}}>Your personal score is 0.0</Text>   
                </View>
                <MaterialCommunityIcons
                    name="information-outline"
                    size={30}
                    color="black"
                    style={{marginLeft:10}}
                />
            </View>
                </View>
                    <View style={styles.DetectBox}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={50}
                            color="black"
                        />
                        <Text style={styles.BoxPoint}>+5 points</Text>
                        <Text style={styles.BoxTitle}>Balanced Blood Work</Text>

                        <MaterialCommunityIcons
                            name="information-outline"
                            size={30}
                            color="black"
                            style={{position:'absolute',top:0,right:0}}
                        />
                    </View>     
            </View>

        </View>

    </ScrollView>
    )
}


const handleNavigation = (path) => {
    const data = {
        title: path
    }
    navigation.navigate("FeaturePage",{data:data})
}

function Navbar(){
    return(
        <ScrollView horizontal style={{position:"absolute",paddingTop:60,paddingLeft:40,marginRight:"auto",flexDirection:"row",zIndex:5,backgroundColor:"white",paddingBottom:15 ,borderWidth:0.3}} showsHorizontalScrollIndicator="false">
            <TouchableOpacity onPress={() => setIsSelected("ai_vision")} style={isSelected == "ai_vision" ? {borderBottomColor:"magenta",borderBottomWidth:2} : {}}>
                <Text style={isSelected == "ai_vision"?{fontWeight:"800",color:"black"}:{opacity:0.4,fontWeight:800,color:"black"}}>AI Vision</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSelected("blood_work")} style={isSelected == "blood_work" ? {borderBottomColor:"magenta",borderBottomWidth:2,marginLeft:30} : {marginLeft:30}}>
                <Text style={isSelected == "blood_work" ? {fontWeight:"800",color:"black"} : {opacity:0.4,fontWeight:800,color:"black"}}>Blood Work</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSelected("diagnosis")} style={isSelected == "diagnosis" ? {borderBottomColor:"magenta",borderBottomWidth:2,marginLeft:30,} : {marginLeft:30}}>
                <Text style={isSelected == "diagnosis" ? {fontWeight:"800",color:"black"} : {opacity:0.4,fontWeight:800,color:"black"}}>Custom Diagnosis</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSelected("soon")} style={isSelected == "soon" ? {borderBottomColor:"magenta",borderBottomWidth:2,marginLeft:30,marginRight:70} : {marginLeft:30,marginRight:70}}>
                <Text style={isSelected == "soon" ? {fontWeight:"800",color:"black"} : {opacity:0.4,fontWeight:800,color:"black"}}>Coming Soon</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const scrollViewRef = useRef(null);
const skinCancerRef = useRef(null);
const bloodAnalysisRef = useRef(null);
const diagnosisRef = useRef(null);
const soonRef = useRef(null);

const positions = useRef({
    skinCancer: 0,
    bloodAnalysis: 0,
    diagnosis: 0,
    soon: 0
});

useEffect(() => {
  // Calculate positions after the initial render
  setTimeout(() => {
    skinCancerRef.current.measure((x, y, width, height, pageX, pageY) => {
      positions.current.skinCancer = pageY;
    });

    bloodAnalysisRef.current.measure((x, y, width, height, pageX, pageY) => {
      positions.current.bloodAnalysis = pageY+15;
    });

    diagnosisRef.current.measure((x, y, width, height, pageX, pageY) => {
      positions.current.diagnosis = pageY;
    });

    soonRef.current.measure((x, y, width, height, pageX, pageY) => {
      positions.current.soon = pageY;
    });
  }, 0);
}, []);

const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    if (scrollY >= positions.current.skinCancer && scrollY < positions.current.bloodAnalysis) {
        setIsSelected('ai_vision');
    } else if (scrollY >= positions.current.bloodAnalysis && scrollY < positions.current.diagnosis) {
        setIsSelected('blood_work');
    } else if (scrollY >= positions.current.diagnosis && scrollY < positions.current.soon) {
        setIsSelected('diagnosis');
    } else if (scrollY >= positions.current.soon) {
        setIsSelected('soon');
    }
};

const { width } = Dimensions.get('window');
const [currentPage, setCurrentPage] = useState(0);

const handleScrollReminder = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.floor((offsetX + width / 2) / width);
    setCurrentPage(pageIndex);
}


function DetectionMenu(){

    function SingleBloodBox(isLatest){
        return(
            <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",width:300}}>
            <View style={{marginTop:20,width:"90%",borderLeftWidth:0.3,borderColor:"magenta",paddingLeft:10,opacity:0.6}}>
            { isLatest ? <Text style={{fontSize:12,fontWeight:"700",marginTop:5,opacity:0.5,color:"magenta"}}>Most up to date</Text>:<Text style={{fontSize:12,fontWeight:"700",marginTop:5,opacity:0.5,color:"red"}}>Outdated, but valuable for AI to make comparisons between blood works</Text>      }                                       
                <Text style={{fontSize:12,fontWeight:"700",marginTop:5}}>Date: <Text style={{fontWeight:"300"}}>3 days - 2003.11.17</Text></Text>                                 
                <Text style={{fontSize:14,fontWeight:"700",marginTop:20}}>Your Added Data</Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>1. Basic Health Indicators: <Text style={{fontWeight:"800"}}>0/5</Text>  <Text style={{color:"lightgreen"}}>(✓)</Text> </Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>2. Lipid Panel: <Text style={{fontWeight:"800"}}>0/4</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>3. Iron Studies: <Text style={{fontWeight:"800"}}>0/4</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>4. Liver Function Tests: <Text style={{fontWeight:"800"}}>0/6</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>5. Metabolic Panel: <Text style={{fontWeight:"800"}}>0/8</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>6. Thyroid Panel: <Text style={{fontWeight:"800"}}>0/3</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>7. Inflammatory Markers: <Text style={{fontWeight:"800"}}>0/2</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>8. Hormonal Panel : <Text style={{fontWeight:"800"}}>0/3</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>9. Vitamins & Minerals: <Text style={{fontWeight:"800"}}>0/3</Text></Text>
            </View>
            <View style={{marginTop:20}}>                            
                <ProgressBar progress={0.2} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
            </View>  
            </View>    
        )
    }


    return(
        <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16}>
            <View style={styles.container}>
                {/*SKIN CANCER*/}
                <View ref={skinCancerRef} style={{width:"100%"}}>
                    <Text style={{fontWeight:"800",fontSize:24,margin:15}}>AI vision</Text>
                    <View style={styles.selectBox}>
                        <View style={styles.boxTop}>
                            <View style={{flexDirection:"row"}}>
                                <MaterialCommunityIcons 
                                    name='doctor'
                                    size={30}
                                />
                                <View style={{marginLeft:20}}>
                                    <Text style={{fontWeight:"800",fontSize:16}}>Skin Cancer Monitor</Text>
                                    <Text style={{fontWeight:"400",fontSize:12}}>Desc 2003.11.17 </Text>
                                </View>
                            </View>    
                            <MaterialCommunityIcons 
                                name='bell'
                                size={20}
                            />
                        </View>
                        <View style={styles.boxBottom}>
                            <View style={{padding:1,width:"55%",marginRight:10,opacity:0.6, borderLeftWidth:0.3,paddingLeft:10,borderColor:"magenta"}}>
                                <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Monitored Moles: {"12"}</Text>
                                <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Higher Risk Moles: {"2"}</Text>
                                <Text style={{color:"black",fontSize:12,fontWeight:"300"}}>Outdated Moles: {"0"}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleNavigation("Skin Cancer")} style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:15}}>Open</Text>
                                <MaterialCommunityIcons 
                                    name='arrow-right'
                                    size={15}
                                    color={"magenta"}                                                                        
                                />
                            </TouchableOpacity>                            
                        </View>      
                    </View>
                    <Text style={{marginRight:"auto",marginLeft:"auto",fontSize:20,fontWeight:"600",opacity:0.3,marginBottom:20,marginTop:10}}>More fetures coming soon ...</Text>
                </View>
                {/*Blood Analasis*/}
                <View ref={bloodAnalysisRef} style={{width:"100%"}}>
                    <Text style={{fontWeight:"800",fontSize:24,margin:15,marginTop:40}}>Blood Analasis</Text>
                    <View style={styles.selectBox}>
                            <View style={styles.boxTop}>
                                <View style={{flexDirection:"row"}}>
                                    <MaterialCommunityIcons 
                                        name='folder'
                                        size={30}
                                    />
                                    <View style={{marginLeft:20}}>
                                        <Text style={{fontWeight:"800",fontSize:16}}>Blood Work Center</Text>
                                        <Text style={{fontWeight:"400",fontSize:10,marginTop:3,maxWidth:"85%",opacity:0.4}}>Number of blood works: 2</Text>
                                    </View>
                                </View>    
                                <MaterialCommunityIcons 
                                    name='bell'
                                    size={20}
                                    color={"black"}
                                    opacity={0.4}
                                />
                            </View>
                          
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={handleScrollReminder}               
                                contentContainerStyle={{width:"400%",marginTop:0}}
                                scrollEventThrottle={16}  
                            > 
                            {SingleBloodBox(isLatest=true) }
                            {SingleBloodBox(isLatest=false) }  
                            </ScrollView>
                            <View style={styles.IndicatorContainer}>               
                                <View style={[styles.Indicator, { opacity: currentPage === 0 ? 1 : 0.3 }]} />   
                                <View style={[styles.Indicator, { opacity: currentPage === 1 ? 1 : 0.3 }]} />                                                                              
                            </View>                     
                            <View style={[styles.boxBottom,{marginTop:5}]}>                                
                                <TouchableOpacity style={{width:"100%",backgroundColor:"black",padding:10,paddingVertical:12,alignItems:"center",justifyContent:"center",borderRadius:20,flexDirection:"row"}}>
                                    <Text style={{fontWeight:"600",color:"white",marginRight:15}}>Open</Text>
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
                                    <Text style={{fontWeight:"800",fontSize:16}}>Blood Work Analasis</Text>
                                    <Text style={{fontWeight:"400",fontSize:10,maxWidth:"85%",opacity:0.5}}>Detailed Analasis with advice and hands on practices </Text>
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
                            <TouchableOpacity style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:15}}>Open</Text>
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
                                    <Text style={{fontWeight:"800",fontSize:16}}>Figure out the root cause</Text>
                                    <Text style={{fontWeight:"400",fontSize:10,maxWidth:"85%",opacity:0.5}}>Detailed Analasis with advice and hands on practices </Text>
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
                            <TouchableOpacity style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:15}}>Open</Text>
                                <MaterialCommunityIcons 
                                    name='arrow-right'
                                    size={15}
                                    color={"magenta"}                                                                        
                                />
                            </TouchableOpacity>                            
                        </View>      
                    </View> 
                </View>
                <View ref={diagnosisRef}  style={{width:"100%"}}>
                    <Text style={{fontWeight:"800",fontSize:24,margin:15,marginTop:40}}>Custom Diagnosis</Text>
                    {diagnosisData.map((data) => (
                        <View style={styles.selectBox}>
                            <View style={styles.boxTop}>
                                <View style={{flexDirection:"row"}}>
                                    <MaterialCommunityIcons 
                                        name='magnify'
                                        size={30}
                                    />
                                    <View style={{marginLeft:20}}>
                                        <Text style={{fontWeight:"800",fontSize:16}}>{data.title}</Text>
                                        <Text style={{fontWeight:"400",fontSize:14,marginTop:3}}>Diagnosis: <Text style={{fontWeight:"600",opacity:0.5}}>{data.diagnosis}</Text></Text>
                                    </View>
                                </View>    
                                <MaterialCommunityIcons 
                                    name='delete'
                                    size={20}
                                    color={"red"}
                                    opacity={0.4}
                                />
                            </View>
                            <View style={{marginTop:20,width:"90%",borderLeftWidth:0.3,borderColor:"magenta",paddingLeft:10,opacity:0.6}}>                                                  
                                <Text style={{fontSize:12,fontWeight:"700",marginTop:5}}>Reported symphtoms: <Text style={{fontWeight:"300"}}>{data.clientSymphtoms}</Text></Text>
                                <Text style={{fontSize:12,fontWeight:"700",marginTop:5}}>Report Date: <Text style={{fontWeight:"300"}}>3 days ago • {data.created_at}</Text></Text>
                                <Text style={{fontSize:14,fontWeight:"700",marginTop:10}}>Stages</Text>
                                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>1. Diagnosis: DONE  <Text style={{color:"lightgreen"}}>(✓)</Text> </Text>
                                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>2. Sevirity Evalutaion: DONE</Text>
                                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>3. Iterative Elimination: DONE</Text>
                                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>4. Appointment: NOT STARTED</Text>
                            </View>
                            <View style={{marginTop:30}}>
                            <Text style={{fontSize:12,fontWeight:"400",marginBottom:7,opacity:1}}>Diagnosis Stage:  <Text style={{fontWeight:"600",marginBottom:7,opacity:0.4}}>1/4 • Curation</Text></Text>
                                <ProgressBar progress={0.2} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
                            </View>                     
                            <View style={[styles.boxBottom,{marginTop:5}]}>                                
                                <TouchableOpacity style={{width:"100%",backgroundColor:"black",padding:10,paddingVertical:12,alignItems:"center",justifyContent:"center",borderRadius:20,flexDirection:"row"}}>
                                    <Text style={{fontWeight:"600",color:"white",marginRight:15}}>Open</Text>
                                    <MaterialCommunityIcons 
                                        name='arrow-right'
                                        size={15}
                                        color={"magenta"}                                                                        
                                    />
                                </TouchableOpacity>                            
                            </View>      
                        </View>   
                    ))}                             
                </View>
                <View ref={soonRef}  style={{width:"100%"}}>
                    <Text style={{fontWeight:"800",fontSize:24,margin:15,marginTop:40}}>Coming Soon ...</Text>
                    <View style={styles.selectBox}>
                        <View style={styles.boxTop}>
                            <View style={{flexDirection:"row"}}>
                                <MaterialCommunityIcons 
                                    name='magnify'
                                    size={30}
                                />
                                <View style={{marginLeft:20}}>
                                    <Text style={{fontWeight:"800",fontSize:16}}>Session</Text>
                                    <Text style={{fontWeight:"400",fontSize:12}}>Diagnosis: <Text style={{fontWeight:"600",opacity:0.6}}>Valami</Text></Text>
                                </View>
                            </View>    
                            <MaterialCommunityIcons 
                                name='menu'
                                size={20}
                            />
                        </View>
                        <View style={styles.boxBottom}>       
                            <TouchableOpacity style={{width:"100%",backgroundColor:"black",padding:10,alignItems:"center",justifyContent:"center",borderRadius:20,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"white",marginRight:15}}>Open</Text>
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
                                    <Text style={{fontWeight:"800",fontSize:16}}>Skin Cancer</Text>
                                    <Text style={{fontWeight:"400",fontSize:12}}>Desc 2003.11.17 </Text>
                                </View>
                            </View>    
                            <MaterialCommunityIcons 
                                name='menu'
                                size={20}
                            />
                        </View>
                        <View style={styles.boxBottom}>
                            <View style={{padding:10,backgroundColor:"black",width:"55%",marginRight:10,opacity:0.2}}>

                            </View>
                            <TouchableOpacity style={{width:"45%",backgroundColor:"black",padding:10,alignItems:"center",justifyContent:"center",borderRadius:20,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"white",marginRight:15}}>Open</Text>
                                <MaterialCommunityIcons 
                                    name='arrow-right'
                                    size={15}
                                    color={"magenta"}                                                                        
                                />
                            </TouchableOpacity>                            
                        </View>      
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}


return(
    <>
        <Navbar />
        {DetectionMenu()}       
    </>
)}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:100
    },
    personalScoreSection: {
        padding: 20,
        borderBottomColor: 'black',
        alignItems: 'center',
        width: '100%',
    },
    titleTag: {
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 1,
        width: "57%",
        padding: 3,
        borderRadius: 5,
        marginBottom: 5,
    },
    scoreTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    scoreTitleLeft: {
        flexDirection: 'column',
        width: '55%',
        justifyContent:'space-between',
    },
    scoreCircle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 100,
        width: 170,
        height: 170,
        borderColor: 'black',
        marginTop: 20,
        borderStyle: 'dashed',
    },
    //RESULTS
    ResultsScoreSection: {
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent:'left',
        width: '100%',
        marginTop: 20,
    },
    ResultsScoreTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    ResultsScoreTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    ResultBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 150,
        height: 150,
        borderRadius: 10,
        marginRight: 20,
    },
    BoxTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    BoxPoint: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom:10
    },
    //DETECTION
    DetectionSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 20,
    },
    DetectBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 300,
        height: 150,
        borderRadius: 10,
        marginRight: 20,
    },
    selectBox:{
        width:"90%",
        borderWidth:0.3,
        alignItems:"center",
        marginRight:"auto",
        marginLeft:"auto",
        padding:20,
        borderRadius:20,
        marginBottom:20,
        marginTop:10
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
        marginTop: 15,
        marginBottom:10
      },
      Indicator: {
        width: 6,
        height: 6,
        backgroundColor: 'black',
        borderRadius: 3,
        marginHorizontal: 5,
      },

});

const Mstyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:100,
        width: '100%',
        alignItems: 'center',
    },
    titleTag: {
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 1,
        width: "57%",
        padding: 3,
        borderRadius: 5,
        marginBottom: 5,
    },
    MelanomaMonitorSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 20,
        flex:1,
    },
    redDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: 'red',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    greenDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: '#00FF00',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'gray'
    },
    colorExplain: {
        flexDirection: 'column',
        alignItems: 'left',
        position: 'absolute',
        marginTop: 10,
        top: 280,
        left: 20,
    },
    colorExplainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 10,
        top: 100,
        left: 0,
    },
    melanomaTag: {
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 1,
        padding: 3,
        borderRadius: 5,
        width: "43%",
        marginBottom: 5,
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
    analasisSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 30,
    },
    melanomaBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        width: 250,
        height: 350,
        borderRadius: 10,
        marginRight: 10,
        marginLeft:20,
        padding: 20,
        marginBottom: 70,
    },
    showMedicalBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: "80%",
        height: 30,
        borderRadius: 10,
        margin: 10,
    },
    melanomaTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '95%',
    },
    melanomaTitleLeft: {
        flexDirection: 'column',
        width: '60%',
        justifyContent:'space-between',
    },
    redDotLabel: {
        width: 40,
        height: 40,
        borderRadius: 0,
        borderTopRightRadius: 10,
        borderBottomLeftRadius:20,
        backgroundColor: 'red',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'gray',
        top: 0,
        right: 0,
    },
    showMoreBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: "80%",
        height: 30,
        borderRadius: 10,
        margin: 10,
    },
    AddMelanomaBtn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        width: "70%",
        height: 80,
        borderRadius: 10,
        margin: 10,
        marginTop:30
    },
    educationSection:{
        width:"100%",
        alignItems:"center"
    },

})

export default DetectionLibary;