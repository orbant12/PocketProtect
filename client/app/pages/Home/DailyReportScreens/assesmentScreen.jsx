


import { View,Text,TouchableOpacity,StyleSheet,Pressable,ScrollView,TextInput } from "react-native"
import React,{useState} from "react"
import ProgressBar from 'react-native-progress/Bar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from "../../../context/UserAuthContext";
import { saveBloodWork,updateBloodWork } from '../../../services/server';
import moment from 'moment'

const AssesmentScreen = ({navigation,route}) => {

//<==================<[ Variables ]>====================>

    const type = route.params.type
    const { currentuser } = useAuth()    
    const [progress , setProgress] = useState(0)    
    const [ isSaveModalActive, setIsSaveModalActive] = useState(false)
    const [ saveCardModalActive, setSaveCardModalActive] = useState(false)
    const [ focused,setFocused] = useState(false)
    const [ creationDate,setCreationDate] = useState("2001-08-25T23:15:00.000Z")
    const [ methodSelected, setMethodSelected] = useState("")    
    const [ bloodWorkData2, setBloodWorkData2] = useState([
        {
            title:"Basic Health Indicators",
            data:[
                {type:"Hemoglobin (Hgb)",number:0},
                {type:"Hematocrit (Hct)",number:0},
                {type:"Red Blood Cell Count (RBC)",number:0},     
                {type:"White Blood Cell Count (WBC)",number:0},   
                {type:"Platelet Count",number:0},               
            ]
        },
        {
            title:"Lipid Panel",
            data:[
                {type:"Total Cholesterol",number:0},
                {type:"High Density Lipoprotein",number:0},
                {type:"Low Density Lipoprotein",number:0},     
                {type:"Triglycerides",number:0},                               
            ]
        },
        {
            title:"Metabolic Panel",
            data:[
                {type:"Glucose",number:0},
                {type:"Blood Urea Nitrogen",number:0},
                {type:"Creatinine",number:0},     
                {type:"Sodium",number:0},
                {type:"Potassium",number:0},  
                {type:"Chloride",number:0},  
                {type:"Carbon Dioxide",number:0},
                {type:"Calcium",number:0}, 
            ]
        },
        {
            title:"Liver Function Tests:",
            data:[
                {type:"Alanine Aminotransferase",number:0},
                {type:"Aspartate Aminotransferase",number:0},
                {type:"Alkaline Phosphatase",number:0},     
                {type:"Bilirubin",number:0},
                {type:"Albumin",number:0},  
                {type:"Total Protein",number:0},    
            ]
        },
        {
            title:"Thyroid Panel:",
            data:[
                {type:"Thyroid Stimulating Hormone",number:0},
                {type:"Free Thyroxine",number:0},
                {type:"Free Triiodothyronine",number:0},     
            ]
        },
        {
            title:"Iron Studies:",
            data:[
                {type:"Serum Iron",number:0},
                {type:"Ferritin",number:0},
                {type:"Total Iron Binding Capacity",number:0},     
                {type:"Transferrin Saturation",number:0}, 
            ]
        }, 
        {
            title:"Vitamins and Minerals:",
            data:[
                {type:"Vitamin D",number:0},
                {type:"Vitamin B12",number:0},
                {type:"Folate",number:0},                     
            ]
        }, 
        {
            title:"Inflammatory Markers:",
            data:[
                {type:"C Reactive Protein",number:0},
                {type:"Erythrocyte Sedimentation Rate",number:0},                                    
            ]
        },  
        {
            title:"Hormonal Panel:",
            data:[
                {type:"Testosterone",number:0},
                {type:"Estrogen",number:0},    
                {type:"Progesterone",number:0},                                  
            ]
        },
    ])
    
    const dataFixed = [
            {
                q: "Select a method to upload your blood work",
                component: <Methods handleMethodSelect={handleMethodSelect} methodSelected={methodSelected} />
            },
            {
                q: "When did you receive your blood work results",
                component: <DateInput />
            },
            {
                q: "Why did you decide to make your blood work",
                component: <Why />
            }
    ]



//<==================<[ Functions ]>====================>

    const onDateChange = (event, date) => {
        console.log(date)
        setCreationDate(String(date))
    };

    function formattedDate(timestampRaw) {    
        if(timestampRaw == "Not provided yet"){
            return timestampRaw
        } else{
            const format = moment(timestampRaw).format('YYYY.MM.DD')
            return format;
        }    
    };
    
    const handleDataChange2 = (title,type,e) => {
        setBloodWorkData2((prevData) => 
            prevData.map((section) => 
                section.title === title 
                    ? {
                        ...section,
                        data: section.data.map((item) => 
                            item.type === type
                                ? { ...item, number: e }
                                : item
                        ),
                    }
                    : section
            )
        );  
    }
    
    function generateUID(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let uid = '';
        for (let i = 0; i < length; i++) {
          uid += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return uid;
    }
    
    const handleSaveProgress = async (type) => {
        const UID = generateUID(16)
        if(type == "first"){
            const response = await saveBloodWork({
                userId: currentuser.uid,
                data: bloodWorkData2,
                Create_Date: creationDate,        
                id: `Blood_${UID}`,
                higherRisk: false
            })
            if ( response == true){
                navigation.goBack()
            } else {
                console.log(response)
            }
        } else if (type == "update"){
            const response = await updateBloodWork({
                userId: currentuser.uid,
                data: bloodWorkData2,
                Create_Date: creationDate,        
                id: `Blood_${UID}`,
                higherRisk: false
            })
            if ( response == true){
                navigation.goBack()
            } else {
                console.log(response)
            }
        }    
    }
    
    const handleBack = (permission) => {
        if (progress == 0 || permission == true){
            navigation.goBack()
        } else {
            setProgress(progress - 1)
        }
    }
        
    const handleMethodSelect = (input) => {
        setMethodSelected(input);    
    };

    const handleUpload = () => {        
        setProgress(1)
    }


//<==================<[ Components ]>====================>

    function Methods(){
        return(
            <View style={{width:"100%",height:"70%",alignItems:"center",marginTop:10}}>
                <SelectableBar 
                    methodSelected={methodSelected}
                    handleMethodSelect={handleMethodSelect}
                    type={"gallery"}
                    title={"Upload from gallery"}
                    icon_name={"image"}
                />

                <SelectableBar 
                    methodSelected={methodSelected}
                    handleMethodSelect={handleMethodSelect}
                    type={"manual"}
                    title={"Add in manually"}
                    icon_name={"fingerprint"}
                />

                <SelectableBar 
                    methodSelected={methodSelected}
                    handleMethodSelect={handleMethodSelect}
                    type={"pdf"}
                    title={"Upload from PDF"}
                    icon_name={"file-upload"}
                />

                <SelectableBar 
                    methodSelected={methodSelected}
                    handleMethodSelect={handleMethodSelect}
                    type={"scan"}
                    title={"Scan with your camera"}
                    icon_name={"data-matrix-scan"}
                />              
            </View>    
        )
    }
    
    function DateInput(){ 
        return(
            <>          
            <DateTimePicker onChange={(e,d) => onDateChange(e,d)} value={new Date(creationDate)} mode="date" style={{marginTop:0}} />
            {creationDate == "2001-08-25T23:15:00.000Z" ?
            <Text style={{fontWeight:"600"}}>Last Updated: <Text style={{opacity:0.4}}>First Time</Text></Text>
            :
            <Text style={{fontWeight:"600"}}>Last Updated:<Text style={{opacity:0.4}}>{creationDate}</Text></Text>
            }
            </>
        )
    }
    
    function Why(){
        return(
            <Text style={{color:"black"}}>Hi</Text>
        )
    }
    
    function BloodWorkComponent(index){
        return(
            <ScrollView style={{width:"100%",paddingTop:10}}>
                <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
                    {bloodWorkData2[index].data.map((dataFrom) =>(
                        <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginTop:20,borderWidth:2,padding:20,borderRadius:20}}>
                            <Text style={{fontWeight:"600",width:"70%"}}>{dataFrom.type}</Text>
                            <View style={{borderLeftWidth:2}}>        
                                <TextInput 
                                    keyboardType="numeric"
                                    style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10,marginLeft:20}}                   
                                    value={`${dataFrom.number}`}
                                    onChangeText={(e) => handleDataChange2(bloodWorkData2[index].title,dataFrom.type,e)}
                                    textAlign="center"      
                                    onFocus={() => setFocused(true)}      
                                />                   
                            </View> 
                        </View>
                    ))
                        
                    }       
                </View>
            </ScrollView>
        )
    }
    
    function FinishPage(){
        return(
            <View style={{width:"100%",alignItems:"center"}}>
                <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>

                </View>
            </View>
        )
    }
    
    function FirstScreen(){
        return(
            <View style={styles.startScreen}>
                <View style={{marginTop:60,alignItems:"center",justifyContent:"space-between",height:"70%"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:24,backgroundColor:"white"}}>Why complete this report ?</Text>
                    <View style={{width:"80%",marginTop:50,height:200,justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="magnify-scan"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white",width:"100%"}}>Designed by medical researchers and doctors</Text>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="creation"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white"}}>Most diaseses can be detected by tracking reccourant symtoms daily</Text>
                        </View>

                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="calendar-today"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white"}}>We can monitor and keep track of your health and potential reoccuring symptoms</Text>
                        </View>


                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                            <MaterialCommunityIcons 
                                name="doctor"
                                size={20}
                            />
                            <Text style={{marginLeft:10,fontWeight:"500",fontSize:13,backgroundColor:"white"}}>Our Ai Model can see your daily reports and use them for more accurate analasis and health advice</Text>
                        </View>                                        
                    </View>

                    <View style={{width:"80%",borderRadius:5,backgroundColor:"lightgray",padding:10,marginTop:60,opacity:0.8}}>
                        <Text style={{marginLeft:10,fontWeight:"600",fontSize:13,}}>Imagine visiting your doctor daily, reporting your health that can be used to make analasis today and can be used in the future</Text>
                    </View>
                </View>
                <Pressable onPress={() => setProgress(1)} style={[styles.startButton,{marginBottom:20}]}>
                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Start Now</Text>
                </Pressable>
            </View>
        )
    }


    function FactScreen(){
        return(
            <View style={[styles.startScreen,{justifyContent:"space-between",height:"90%",marginTop:30}]}>
                    <View style={{width:"100%",alignItems:"center",marginBottom:50,height:"70%",justifyContent:"space-between"}}>
                        <View style={{width:"100%",alignItems:"center"}}>
                            <Image 
                                source={""} 
                                style={{width:230,height:230,borderRadius:"120%",borderWidth:0.5,borderColor:"lightgray",marginTop:0}}                                               
                            />
                            <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:10}}>Deep Learning Neural Network</Text>
                            <Text style={{fontWeight:"700",fontSize:20,maxWidth:"80%",textAlign:"center",marginTop:0}}>+ Dermotologist</Text>
                        </View>     
                        <View>
                            <Text style={{fontWeight:"550",fontSize:12,maxWidth:"90%",textAlign:"center",marginTop:5,opacity:0.7,marginTop:20,textAlign:"justify"}}>Our AI model can detect malignant moles with a <Text style={{color:"magenta",fontWeight:"600"}}>95%</Text> accuracy which is <Text style={{color:"magenta",fontWeight:"600"}}>+20% </Text>better then the accuracy of dermotologists</Text> 
                            <Text style={{fontWeight:"550",fontSize:12,maxWidth:"90%",textAlign:"center",marginTop:5,opacity:0.7,marginTop:30,textAlign:"justify"}}>Your moles can be supervised by both <Text style={{color:"magenta",fontWeight:"800"}}>AI & Dermotologist</Text> to be as protected as possible and alert you to consult a possible removal with your dermotologist</Text> 
                        </View> 
                    </View>                   
                    <TouchableOpacity onPress={() => setProgress(progress + 0.1)} style={{width:"80%",padding:5,flexDirection:"row",alignItems:"center",borderWidth:0,backgroundColor:"black",borderRadius:40,position:"absolute",bottom:20}}>
                        <View style={{backgroundColor:"white",padding:10,borderRadius:30}}>
                            <MaterialCommunityIcons 
                                name="check-all"
                                size={25}
                                color={"black"}
                            />
                        </View>         
                        <Text style={{marginLeft:20,fontSize:15,color:"white",fontWeight:"700",opacity:0.9,textAlign:"center",justifyContent:"center"}}>Next</Text>
                    </TouchableOpacity>
            </View>
        )
    }
    
    const SaveModal = ({saveCardModalActive}) => {
        return(
            <>
            {saveCardModalActive &&
                <View style={styles.modal}>
                    <View style={styles.modalSaveCard}>      
                        <View style={{width:"100%",alignItems:"center"}}>
                            <Text style={{fontWeight:"700",fontSize:20,marginTop:20}}>Your Data is Saved Succesfully</Text>   
                        </View> 
            
                        <View style={{width:"60%",justifyContent:"space-between",flexDirection:"row",borderTopWidth:0.3,padding:5,paddingTop:20}}>
                            <TouchableOpacity style={{backgroundColor:"black",padding:10,borderRadius:10,alignItems:"center"}} onPress={() => {setSaveCardModalActive(!saveCardModalActive)}}>
                                <Text style={{color:"white",fontWeight:"500"}}>Go Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:"white",padding:10,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:20}} onPress={() =>  handleSaveProgress(type)}>
                                <Text style={{color:"black",fontWeight:"500"}}>Leave</Text>
                            </TouchableOpacity>                                    
                        </View> 
                    </View>
                </View>
            }
            </>
        )
    }
    
    const ExitModal = ({isSaveModalActive}) => {
        return(
            <>
            {isSaveModalActive &&
                <View style={styles.modal}>
                    <View style={styles.modalCard}>
                        <Text style={{fontWeight:"700",fontSize:17,borderWidth:0,paddingTop:30}}>Your provided data is going to be lost. Do you want to save it ?</Text>
                        <View style={{width:"100%",justifyContent:"space-between",flexDirection:"row",borderTopWidth:0.3,padding:5,paddingTop:20}}>
                            <TouchableOpacity style={{backgroundColor:"black",padding:10,borderRadius:10,alignItems:"center"}} onPress={() => setIsSaveModalActive(!isSaveModalActive)}>
                                <Text style={{color:"white",fontWeight:"500"}}>Go Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:"white",padding:10,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:100}} onPress={() => {setSaveCardModalActive(!saveCardModalActive);setIsSaveModalActive(!isSaveModalActive)}}>
                                <Text style={{color:"black",fontWeight:"500"}}>Yes</Text>
                            </TouchableOpacity>    
                            <TouchableOpacity style={{backgroundColor:"red",padding:10,borderRadius:10,alignItems:"center",}} onPress={() => handleBack(true)}>
                                <Text style={{color:"white",fontWeight:"600"}}>No</Text>
                            </TouchableOpacity>                      
                        </View> 
                    </View>
                </View>
            }
            </>
        )
    }

//<==================<[ Mian Return ]>====================>

    return(
        <>
            {ExitModal({isSaveModalActive})}
            {SaveModal({saveCardModalActive})}            
            <View style={styles.container}>            
                <ProgressRow 
                    handleBack={handleBack}
                    progress={progress} 
                    dataFixed={dataFixed}                     
                    setIsSaveModalActive={setIsSaveModalActive} 
                    isSaveModalActive={isSaveModalActive}                     
                    ProgressBar={ProgressBar}
                />
                {progress == 0 ?
                    FirstScreen()                
                :                
                    <View style={{width:"100%",alignItems:"center",height:"90%",justifyContent:"space-between",marginTop:55,borderWidth:0}}>
                        <View style={{width:"90%",alignItems:"center",backgroundColor:"#eee",justifyContent:"center",padding:20,borderRadius:20,marginTop:10}}>                      
                            <Text style={{fontWeight:"700",fontSize:"20",width:"100%",textAlign:"center"}}>{dataFixed[progress - 1].q}</Text>                                                             
                        </View>                                                 
                        {dataFixed[progress-1].component}
                        {progress == dataFixed.length ?
                            <Pressable onPress={() => handleUpload(methodSelected)} style={[styles.startButton,{marginBottom:10}]}>                        
                                <Text style={{padding:14,fontWeight:"600",color:"white"}}>Upload</Text>
                            </Pressable>
                            :
                            <Pressable onPress={() => setProgress(progress + 1)} style={[styles.startButton,{marginBottom:10}]}>                        
                                <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                            </Pressable>
                        }                                                                   
                        <Text style={{paddingVertical:10,paddingHorizontal:15,borderWidth:1,borderRadius:10,position:"absolute",right:10,bottom:20,opacity:0.3}}>{progress} / {dataFixed.length}</Text>
                    </View>
                }                                  
            </View>
        </>
    )
}


//<==================<[ Styles Sheet ]>====================>

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
        justifyContent:"space-between"
    },
    container:{
        alignItems:"center",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        backgroundColor:"white",
        justifyContent:"space-between"
    },
    btn:{
        padding:10,
        borderWidth:1,
        backgroundColor:"black",
        justifyContent:"center",
        borderRadius:10,
        width:150,
        height:50,    
        alignItems:"center"
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
    modal:{
        width:"100%",
        height:"100%",
        zIndex:10
,        backgroundColor:"rgba(0,0,0,0.85)",
        justifyContent:"center",
        alignItems:"center",
        position:"absolute"
    },
    modalCard:{
        width:330,
        height:200,
        backgroundColor:"white",
        marginBottom:50,
        borderRadius:20,
        justifyContent:"space-between",
        alignItems:"center",
        padding:15
    },
    modalSaveCard:{
        width:330,
        height:"30%",
        backgroundColor:"white",
        marginBottom:50,
        borderRadius:20,
        justifyContent:"space-between",
        alignItems:"center",
        padding:15
    },
    startScreen:{
        borderWidth:0,
        marginBottom:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        height:"100%",
        justifyContent:"space-between",
        backgroundColor:"white",
        zIndex:-1
    },
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,
        marginBottom:2,
        backgroundColor:"black"
    },
    startButtonNA:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:10,
        opacity:0.3
    },
})


export default AssesmentScreen 




const ProgressRow = ({progress,dataFixed,setIsSaveModalActive,isSaveModalActive,ProgressBar}) => {
    return(
        <View style={styles.ProgressBar}>
        <TouchableOpacity onPress={handleBack} style={{backgroundColor:"#eee",borderRadius:30}}>
            <MaterialCommunityIcons 
                name="arrow-left"
                size={20}
                style={{padding:5}}
            />
        </TouchableOpacity>        
            <ProgressBar progress={progress / dataFixed.length} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />                                        
        <TouchableOpacity onPress={() => setIsSaveModalActive(!isSaveModalActive)} style={{backgroundColor:"#eee",borderRadius:30}}>
            <MaterialCommunityIcons 
                name="close"
                size={20}
                style={{padding:5}}
            />
        </TouchableOpacity>
        </View>
    )
}



const SelectableBar = ({
    handleMethodSelect,
    methodSelected,
    type,
    title,
    icon_name
}) => {
    return(
        <TouchableOpacity onPress={() => handleMethodSelect(type)} style={[{width:"95%",padding:0,flexDirection:"row",alignItems:"center",borderWidth:2,borderRadius:10}, methodSelected == type && {borderColor:"magenta"}]}>
            <View style={[{borderWidth:0,padding:15,borderRightWidth:2,borderRadius:10,borderTopRightRadius:0,borderBottomRightRadius:0},methodSelected == type && {borderColor:"magenta"}]}>
                <MaterialCommunityIcons 
                    name={icon_name}
                    size={30}
                    color={methodSelected == type ? "magenta" : "black"}
                />   
            </View>                       
            <Text style={{marginLeft:20,fontWeight:"700",fontSize:17,opacity:0.7}}>{title}</Text>     
        </TouchableOpacity>
    )
}