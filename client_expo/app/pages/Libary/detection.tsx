
import { View, Text, Pressable, ScrollView,StyleSheet,TouchableOpacity,Dimensions,RefreshControl } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect, useState, useRef,useCallback} from 'react';
import { useAuth } from '../../context/UserAuthContext';
import { fetchAllDiagnosis, fetchUserData,fetchNumberOfMoles } from '../../services/server';
import { MainBloodBox, MainMelanomaBox, MainDiagnosisBox } from '../../components/LibaryPage/mainBoxes';
import { styles } from '../../styles/libary_style';
import { Horizontal_Navbar} from '../../components/LibaryPage/mainNav';
import { Navigation_MelanomaCenter, Navigation_MelanomaFullsetup } from '../../navigation/navigation';
import { styles_shadow } from '../../styles/shadow_styles';
import { UserData_Default } from '../../utils/initialValues';
import { Gender } from '../../utils/types';
import { DiagnosisData } from '../../utils/types';

type NavbarValues = "ai_vision" | "blood_work" | "diagnosis" | "soon"

const DetectionLibary = ({
    navigation,
    scrollViewRef,
    isSelected,
    setIsSelected,
    positions
}) => {

//<==================<[ Variable ]>====================>     

const { currentuser } = useAuth();
const [ diagnosisData, setDiagnosisData] = useState<DiagnosisData[]>([])
//REFS
const skinCancerRef = useRef(null);
const bloodAnalysisRef = useRef(null);
const diagnosisRef = useRef(null);
const soonRef = useRef(null);

//H-Swiper
const { width } = Dimensions.get('window');
const [currentPage, setCurrentPage] = useState(0);
//REFRESH
const [refreshing, setRefreshing] = useState(false);
const [userData, setUserData] = useState(UserData_Default)
//SkinCancer
const [skinCancerProgress, setSkinCancerProgress] = useState(0)
const [ skinCancerData, setSkinCancerData] = useState({
    malignant:0,
    bening:0,
    outdated:0,
    all:0,
    completed:0,
})






//<==================<[ Functions ]>====================>   

const fetchDiagnosis = async () => {
    const response = await fetchAllDiagnosis({
        userId: currentuser.uid,
    })
    if(response != false && response != "NoDiagnosis"){
        setDiagnosisData(response)
    } else if (response == false){
        alert("Something went wrong !")
    } else if ( response == "NoDiagnosis"){
        
    }
}

const fetchMoles = async (gender:Gender) => {
    if(currentuser){
        const response = await fetchNumberOfMoles({
            userId:currentuser.uid,
            gender: gender
        })
        if(response != false){
            setSkinCancerData(response)
            setSkinCancerProgress(response.outdated / 24)
        }
    }

}

const fetchAllUserData = async () => {
    if(currentuser){
        const response = await fetchUserData({
            userId:currentuser.uid,
        })
        setUserData(response)
        fetchMoles(response.gender)        
    }
}

const handleNavigation = (path) => {
    if( path == "MelanomaCenter"){
        Navigation_MelanomaCenter({navigation})
    } else if ( path == "MelanomaFullprocess"){
        Navigation_MelanomaFullsetup({navigation})
    }
}



const handleScrollReminder = (event) => {
    const offsetX = event.nativeEvent.contentOffset;
    const pageIndex = Math.floor((offsetX + width / 2) / width);
    setCurrentPage(pageIndex);
}

const handleScroll = useCallback((event) => {
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
}, []);

const onRefresh = useCallback(() => {
    setRefreshing(true);
    //
    fetchDiagnosis()
    fetchMoles(userData.gender)
    fetchAllUserData()
    setTimeout(() => {
        setRefreshing(false);
    }, 2000); // Example: setTimeout for simulating a delay
}, []);

useEffect(() => {      
    fetchDiagnosis()    
    fetchAllUserData()

    setTimeout(() => {
        skinCancerRef.current.measure((x, y, width, height, pageX, pageY) => {
          positions.current.skinCancer = pageY - 200;
        });
    
        bloodAnalysisRef.current.measure((x, y, width, height, pageX, pageY) => {
          positions.current.bloodAnalysis = pageY - 240;
        });
    
        diagnosisRef.current.measure((x, y, width, height, pageX, pageY) => {
          positions.current.diagnosis = pageY - 240;
        });
    
        soonRef.current.measure((x, y, width, height, pageX, pageY) => {
          positions.current.soon = pageY - 100;
        });
    }, 0);
}, []);

//<==================<[ Main Return ]>====================> 

return(
<>      
            <ScrollView
                style={{backgroundColor:"white",width:"100%",zIndex:100,marginTop:200}}
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['magenta']}
                        tintColor={'magenta'}
                        style={{zIndex:100}}
                    />
                }
            >
      
            <View style={styles.container}>
                {/*SKIN CANCER*/}
                <View ref={skinCancerRef} style={{width:"100%",paddingTop:50}}>
                    <Text style={{fontWeight:"800",fontSize:24,margin:15}}>AI vision</Text>
                    <MainMelanomaBox
                        skinCancerData={skinCancerData}
                        skinCancerProgress={skinCancerProgress}
                        handleNavigation={handleNavigation}
                    />
                    <View style={[styles.selectBox]}>
                        <View style={styles.boxTop}>
                            <View style={{flexDirection:"row"}}>
                                <MaterialCommunityIcons 
                                    name='doctor'
                                    size={30}
                                />
                                <View style={{marginLeft:20}}>
                                    <Text style={{fontWeight:"800",fontSize:16}}>Full Body Setup</Text>
                                    <Text style={{fontWeight:"400",fontSize:10,opacity:0.6}}>Skin Cancer </Text>
                                </View>
                            </View>    
                            <MaterialCommunityIcons 
                                name=''
                                size={20}
                            />
                        </View>
                        <View style={styles.boxBottom}>
                            <View style={{padding:1,width:"55%",marginRight:10,opacity:0.6, borderLeftWidth:0.3,paddingLeft:10,borderColor:"magenta"}}>
                                <Text style={{color:"black",marginBottom:8,fontSize:12,fontWeight:"300"}}>Setup Time: <Text style={{fontWeight:"600"}}>{"15"} min</Text></Text>
                                <Text style={{color:"black",marginBottom:0,fontSize:10,fontWeight:"300"}}>Monitored by<Text style={{fontWeight:"600"}}> Dermotologists & Neural Network</Text></Text>                                
                            </View>
                            <TouchableOpacity onPress={() => handleNavigation("MelanomaFullprocess")} style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
                                <Text style={{fontWeight:"600",color:"white",marginRight:15,fontSize:15}}>Start</Text>
                                <MaterialCommunityIcons 
                                    name='arrow-right'
                                    size={20}
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
                    <MainBloodBox 
                        navigation={navigation}
                        handleScrollReminder={handleScrollReminder}
                        currentPage={currentPage}
                    />
                </View>
                {/*DIAGNOSIS*/}
                <View ref={diagnosisRef}  style={{width:"100%"}}>
                    <Text style={{fontWeight:"800",fontSize:24,margin:15,marginTop:40}}>Custom Diagnosis</Text>
                    {diagnosisData.map((data,index) => (
                        <MainDiagnosisBox 
                            navigation={navigation}
                            data={data}
                            key={index}
                        />
                    ))}
                    <View style={styles.selectBox}>
                        <View style={styles.boxTop}>
                            <View style={{flexDirection:"row"}}>
                                <MaterialCommunityIcons 
                                    name='doctor'
                                    size={30}
                                />
                                <View style={{marginLeft:20}}>
                                    <Text style={{fontWeight:"800",fontSize:16}}>Start a diagnosis process</Text>
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
                            <TouchableOpacity onPress={() => navigation.navigate("add-detection")} style={{width:"45%",backgroundColor:"black",padding:10,paddingVertical:18,alignItems:"center",justifyContent:"center",borderRadius:10,flexDirection:"row"}}>
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
                {/*SOON NEWS*/}
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
    
    </>
)}


export default DetectionLibary;