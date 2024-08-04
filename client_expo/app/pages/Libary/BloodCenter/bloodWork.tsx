
import { View,Text,TouchableOpacity } from "react-native"
import React,{useState} from "react"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from "../../../context/UserAuthContext";
import { saveBloodWork, updateBloodWork } from "../../../services/server"
import { BloodWorkData_Default } from "../../../utils/initialValues";
import { BloodWorkData } from "../../../services/server";
import { add_styles } from "../../../styles/blood_styles";
import { ExitModal } from "./Blood_Add_Components/exitModal";
import { SaveModal } from "./Blood_Add_Components/saveModal";
import { ProgressRow } from "../../../components/ExplainPages/explainPage";
import { FirstScreen } from "./Blood_Add_Components/welcome_b_add";
import { SelectionPage } from "../../../components/Common/SelectableComponents/selectPage";
import { DateInputPage } from "../../Auth/OnBoarding_Components/dateInput";
import { ManualBloodAddPage } from "./Blood_Add_Components/manual_b_add";
import { DateToString } from "../../../utils/date_manipulations";

const BloodWorkPage = ({navigation,route}) => {

//<==================<[ Variables ]>====================>

    const type:"first" | "update" = route.params.type
    const { currentuser } = useAuth()    
    const [progress , setProgress] = useState(0)    
    const [ isSaveModalActive, setIsSaveModalActive] = useState(false)
    const [ saveCardModalActive, setSaveCardModalActive] = useState(false)
    const [creationDate, setCreationDate] = useState(new Date(2098051730000));
    const [ methodSelected, setMethodSelected] = useState("")
    const [bloodWorkData, setBloodWorkData] = useState<BloodWorkData>(BloodWorkData_Default);
    const [initialProgress, setInitialProgress] = useState(0)
    

//<==================<[ Functions ]>====================>

    function round(value: number, decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
    
    const handleBloodWorkDataChange = (title:string,type:string,e:any) => {
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
                Create_Date: DateToString(creationDate),        
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
                Create_Date: DateToString(creationDate),      
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
        if (round(progress,1) == 0 || permission == true){
            navigation.goBack()
        }  else if (initialProgress > 0) {
            setProgress(progress - 0.1)
            setInitialProgress(initialProgress - 1)
        } else {
            setProgress(progress - 0.1)
        }
    }
    
//<==================<[ Mian Return ]>====================>

    return(
        <>
            <View style={add_styles.container}>            
                <ProgressRow 
                    handleBack={(e) => handleBack(e)} 
                    progress={progress / 1.1}
                />
                {round(progress,1) == 0 &&
                    <FirstScreen
                        setProgress={(e) => setProgress(e)} 
                        progress={progress}
                    />             
                }
                {round(progress,1) == 0.1 &&
                    <SelectionPage 
                        pageTitle="Select a method to upload your blood work"
                        selectableOption="bar"
                        selectableData={[{
                            title:"Upload",
                            type:"upload",
                            icon:{type:"icon",metaData:{name:"upload",size:30}}
                        },
                        {
                            title:"Manual",
                            type:"manual",
                            icon:{type:"icon",metaData:{name:"pencil",size:30}}
                        }]}
                        setOptionValue={(e) => setMethodSelected(e)}
                        optionValue={methodSelected}
                        setProgress={(e) => setProgress(0.2)}
                        buttonAction={{type:"next",actionData:{progress:1,increment_value:1}}}
                        pageStyle={{height:"85%",}}
                        desc="ksmdksmdkmskdm"
                    />
                }
                {round(progress,1) == 0.2 &&
                    <DateInputPage 
                        progress={progress}
                        setBirthDate={(e) => setCreationDate(e)}
                        date={creationDate}
                        setProgress={(e) => setProgress(0.3)}
                        title="When did you receive your blood work results"
                        pageStyle={{height:"85%"}}
                        
                    />
                }
                {(round(progress,1) >= 0.3 && round(progress,1) < 1.1) && (
                    <ManualBloodAddPage
                        setProgress={setProgress}
                        handleBloodWorkDataChange={handleBloodWorkDataChange}
                        handleUpload={() => {}}
                        bloodWorkData={bloodWorkData}
                        progress={progress}
                        initialProgress={initialProgress}
                        setInitialProgress={setInitialProgress}
                    />
                )
                }
                {round(progress,1) == 1.1 && 
                    <></>
                }
            </View>
            <SaveModal
                saveCardModalActive={saveCardModalActive}
                type={type}
                setSaveCardModalActive={setSaveCardModalActive}
                handleSaveProgress={handleSaveProgress}
            />
            <ExitModal
                isSaveModalActive={isSaveModalActive}
                saveCardModalActive={saveCardModalActive}
                setIsSaveModalActive={setIsSaveModalActive}
                setSaveCardModalActive={setSaveCardModalActive}
                handleBack={handleBack}
            />
        </>
    )
}

export default BloodWorkPage






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