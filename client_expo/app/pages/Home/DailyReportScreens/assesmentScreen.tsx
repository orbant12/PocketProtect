
import { View,Text,TouchableOpacity,StyleSheet,Pressable,ScrollView,TextInput,Keyboard } from "react-native"
import React,{useEffect, useState,useRef} from "react"
import ProgressBar from 'react-native-progress/Bar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from "../../../context/UserAuthContext";
import { saveBloodWork,fetchBloodWork, updateBloodWork } from "../../../services/server"
import { SelectableBars } from "../../../components/Common/SelectableComponents/selectableBars";
import moment from 'moment'
import { BloodWorkData_Default } from "../../../utils/initialValues";
import { BloodWorkData } from "../../../services/server";
import { Timestamp } from "../../../utils/date_manipulations";

const BloodWorkPage = ({navigation,route}) => {

//<==================<[ Variables ]>====================>

    const type = route.params.type
    const { currentuser } = useAuth()    
    const [progress , setProgress] = useState(0)    
    const [ isSaveModalActive, setIsSaveModalActive] = useState(false)
    const [ saveCardModalActive, setSaveCardModalActive] = useState(false)
    const [ focused,setFocused] = useState(false)
    const [ creationDate,setCreationDate] = useState("2001-08-25T23:15:00.000Z")
    const [ methodSelected, setMethodSelected] = useState("")
    const [ isUploadStage, setIsUploadStage] = useState(false)  
    const [bloodWorkData, setBloodWorkData] = useState<BloodWorkData>(BloodWorkData_Default);
    
    const dataFixed = [
            {
                q: "Select a method to upload your blood work",
                component: <Methods setMethodSelected={setMethodSelected} methodSelected={methodSelected} />
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

    const manual = [
        {
            q:"Basic Health Indicators",
            component:BloodWorkComponent(0)
        },
        {
            q:"Lipid Panel",
            component:BloodWorkComponent(1)
        },
        {
            q:"Metabolic Panel",
            component:BloodWorkComponent(2)
        },
        {
            q:"Liver Function Tests",
            component:BloodWorkComponent(3)
        },
        {
            q:"Thyroid Panel",
            component:BloodWorkComponent(4)
        },
        {
            q:"Iron Studies",
            component:BloodWorkComponent(5)
        },
        {
            q:"Vitamins and Minerals",
            component:BloodWorkComponent(6)
        },
        {
            q:"Inflammatory Markers",
            component:BloodWorkComponent(7)
        },
        {
            q:"Hormonal Panel",
            component:BloodWorkComponent(8)
        },
        {
            q:"We are all done !",
            component:FinishPage()
        }
    ]

    const scan = []

    const gallery = []

    const pdf = []


//<==================<[ Functions ]>====================>

    const onDateChange = (even:any, date:Date) => {
        setCreationDate(String(date))
    };

    function formattedDate(timestampRaw:Timestamp | "Not provided yet") {    
        if(timestampRaw == "Not provided yet"){
            return timestampRaw
        } else{
            const format = moment(timestampRaw).format('YYYY.MM.DD')
            return format;
        }    
    };
    
    const handleDataChange2 = (title:string,type:string,e:any) => {
        setBloodWorkData((prevData) => 
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
    
    function generateUID(length:number) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let uid = '';
        for (let i = 0; i < length; i++) {
          uid += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return uid;
    }
    
    const handleSaveProgress = async (type:"first" | "update") => {
        const UID = generateUID(16)
        if(type == "first"){
            const response = await saveBloodWork({
                userId: currentuser.uid,
                data: bloodWorkData,
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
                data: bloodWorkData,
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
    
    const handleBack = (permission:boolean) => {
        if (progress == 0 || permission == true){
            navigation.goBack()
        } else {
            setProgress(progress - 1)
        }
    }
    
    const handleUpload = () => {
        setIsUploadStage(true)
        setProgress(1)
    }


//<==================<[ Components ]>====================>

    function Methods({
        setMethodSelected,
        methodSelected
    }:{
        setMethodSelected:(type:string) => void;
        methodSelected: string;
    }){
        return(
            <SelectableBars 
                setOptionValue={setMethodSelected}
                optionValue={methodSelected}
                items={[
                    {type:"gallery", icon:{type:"icon",metaData:{name:"image",size:30}}, title:"Upload from gallery"},
                    {type:"manual", icon:{type:"icon",metaData:{name:"fingerprint",size:30}}, title:"Add in manually"},
                    {type:"pdf", icon:{type:"icon",metaData:{name:"file-upload",size:30}}, title:"Upload from PDF"},
                    {type:"scan", icon:{type:"icon",metaData:{name:"data-matrix-scan",size:30}}, title:"Scan with your camera"}
                ]}
            />
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
                    {bloodWorkData[index].data.map((dataFrom) =>(
                        <View style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginTop:20,borderWidth:2,padding:20,borderRadius:20}}>
                            <Text style={{fontWeight:"600",width:"70%"}}>{dataFrom.type}</Text>
                            <View style={{borderLeftWidth:2}}>        
                                <TextInput 
                                    keyboardType="numeric"
                                    style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10,marginLeft:20}}                   
                                    value={`${dataFrom.number}`}
                                    onChangeText={(e) => handleDataChange2(bloodWorkData[index].title,dataFrom.type,e)}
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
                    manual={manual} 
                    setIsSaveModalActive={setIsSaveModalActive} 
                    isSaveModalActive={isSaveModalActive} 
                    isUploadStage={isUploadStage}
                    ProgressBar={ProgressBar}
                />
                {progress == 0 ?
                    FirstScreen()                
                :
                    focused ?
                        <Pressable onPress={() => {Keyboard.dismiss();setFocused(false)}} style={{width:"100%",alignItems:"center",height:"90%",justifyContent:"space-between",marginTop:55,borderWidth:0}}>
                            <View style={{width:"90%",alignItems:"center",backgroundColor:"#eee",justifyContent:"center",padding:20,borderRadius:20,marginTop:10}}>
                                <Text style={{fontWeight:"700",fontSize:20,width:"100%",textAlign:"center"}}>{dataFixed[progress - 1].q}</Text>            
                            </View> 
                            {!isUploadStage && 
                                <>
                                    {dataFixed[progress-1].component}
                                    {progress == dataFixed.length ?
                                        <Pressable onPress={() => {/*handleUpload(methodSelected)*/{handleUpload()}}} style={[styles.startButton,{marginBottom:10}]}>                        
                                            <Text style={{padding:14,fontWeight:"600",color:"white"}}>Upload</Text>
                                        </Pressable>
                                        :
                                        <Pressable onPress={() => setProgress(progress + 1)} style={[styles.startButton,{marginBottom:10}]}>                        
                                            <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                                        </Pressable>
                                    } 
                                </>
                            }                   
                        </Pressable>
                        :
                        <View style={{width:"100%",alignItems:"center",height:"90%",justifyContent:"space-between",marginTop:55,borderWidth:0}}>
                        <View style={{width:"90%",alignItems:"center",backgroundColor:"#eee",justifyContent:"center",padding:20,borderRadius:20,marginTop:10}}>
                            {!isUploadStage ? 
                            <Text style={{fontWeight:"700",fontSize:20,width:"100%",textAlign:"center"}}>{dataFixed[progress - 1].q}</Text>            
                            :
                            <Text style={{fontWeight:"700",fontSize:20,width:"100%",textAlign:"center"}}>{manual[progress - 1].q}</Text>            
                            }
                        </View> 
                        {!isUploadStage ? 
                        <>
                            {dataFixed[progress-1].component}
                            {progress == dataFixed.length ?
                                <Pressable onPress={() => {/*handleUpload(methodSelected)*/{handleUpload()}}} style={[styles.startButton,{marginBottom:10}]}>                        
                                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Upload</Text>
                                </Pressable>
                                :
                                <Pressable onPress={() => setProgress(progress + 1)} style={[styles.startButton,{marginBottom:10}]}>                        
                                    <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                                </Pressable>
                            } 
                        </>
                        :
                        <>
                        {manual[progress-1].component}
                        {progress == manual.length ?
                            <Pressable onPress={() => {/*handleUpload(methodSelected)*/{handleUpload()}}} style={[styles.startButton,{marginBottom:10}]}>                        
                                <Text style={{padding:14,fontWeight:"600",color:"white"}}>Upload</Text>
                            </Pressable>
                            :
                            <Pressable onPress={() => setProgress(progress + 1)} style={[styles.startButton,{marginBottom:10}]}>                        
                                <Text style={{padding:14,fontWeight:"600",color:"white"}}>Next</Text>
                            </Pressable>
                        } 
                        </>
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


export default BloodWorkPage




const ProgressRow = ({handleBack,progress,dataFixed,manual,setIsSaveModalActive,isSaveModalActive,isUploadStage,ProgressBar}) => {
    return(
        <View style={styles.ProgressBar}>
        <TouchableOpacity onPress={handleBack} style={{backgroundColor:"#eee",borderRadius:30}}>
            <MaterialCommunityIcons 
                name="arrow-left"
                size={20}
                style={{padding:5}}
            />
        </TouchableOpacity>
        {!isUploadStage ?
            <ProgressBar progress={progress / dataFixed.length} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
            :
            <ProgressBar progress={progress / manual.length} width={250} height={5} color={"red"} backgroundColor={"white"} borderColor={"magenta"} />
        }
        
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
        <TouchableOpacity onPress={() => handleMethodSelect(type)} style={[{width:"95%",padding:0,flexDirection:"row",alignItems:"center",borderWidth:2,borderRadius:10,marginTop:20,alignSelf:"center"}, methodSelected == type && {borderColor:"magenta"}]}>
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