import { Text, TouchableOpacity, View } from "react-native"
import { useAuth } from "../../../../context/UserAuthContext";
import { DateToString } from "../../../../utils/date_manipulations";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useEffect, useState } from "react";
import { Diag_InpitField } from "../../../Chat/components/ai_chat/chatInputField";
import { User } from "../../../../models/User";
import { changePersonalData } from "../../../../services/server";
import { SelectionPage } from "../../../../components/Common/SelectableComponents/selectPage";
import { DateInputPage } from "../../../Auth/OnBoarding_Components/dateInput";

export const UserDataChange = () => {

    const { currentuser, handleAuthHandler } = useAuth();

    const [isSelected, setIsSelected] = useState<"fullname" | "birth_date" | "gender" | null>(null)

    const [newName, setNewName] = useState("");
    const [newGender, setNewGender] = useState(currentuser.gender);
    
    function getDatePart(dateString: string): string {
        // Split the string at 'T' to separate the date and time parts
        return dateString.split('T')[0];
    }
        
    const [birthDate, setBirthDate] = useState(new Date(currentuser.birth_date))
    
    const handleSaveData = async (type:"fullname" | "birth_date" | "gender", data:string | Date) => {

        if(type == "birth_date"){
            const res = getDatePart(DateToString(data));
            const response = await changePersonalData({
                fieldNameToChange: type,
                dataToChange: res,
                userId: currentuser.uid,
            })
            if(response == true){
                handleAuthHandler("fetch");
                setIsSelected(null);
            }
        }else {
            const response = await changePersonalData({
                fieldNameToChange: type,
                dataToChange: data,
                userId: currentuser.uid,
            })
            if(response == true){
                handleAuthHandler("fetch");
                setIsSelected(null);
            }
        }
    }

    
    return(
        <>
        {isSelected == null ? 
            <View style={{width:"100%",flexDirection:"column",alignItems:"center",padding:10}}>
                <View style={{width:"90%",flexDirection:"row",alignItems:"center",padding:15,borderWidth:1,justifyContent:"space-between",borderRadius:5,marginTop:40,backgroundColor:"black"}}>
                    <Text style={{fontWeight:600,color:"white"}}>Fullname:</Text>
                    <Text style={{fontWeight:500,color:"white",opacity:0.6}}>{currentuser.fullname}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsSelected("fullname")} style={{margin:15,borderWidth:1,padding:9,borderRadius:10,width:"30%",alignItems:"center",backgroundColor:"black"}}>
                    <Text style={{fontSize:12,color:"white",fontWeight:600}}>
                        Change
                    </Text>
                </TouchableOpacity>

                <View style={{width:"90%",flexDirection:"row",alignItems:"center",padding:15,borderWidth:1,justifyContent:"space-between",borderRadius:5,marginTop:40,backgroundColor:"black"}}>
                    <Text style={{fontWeight:600,color:"white"}}>Birthdate:</Text>
                    <Text style={{fontWeight:500,color:"white",opacity:0.6}}>{DateToString(birthDate)}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsSelected("birth_date")} style={{margin:15,borderWidth:1,padding:9,borderRadius:10,width:"30%",alignItems:"center",backgroundColor:"black"}}>
                    <Text style={{fontSize:12,color:"white",fontWeight:600}}>
                        Change
                    </Text>
                </TouchableOpacity>


                <View style={{width:"90%",flexDirection:"row",alignItems:"center",padding:15,borderWidth:1,justifyContent:"space-between",borderRadius:5,marginTop:40,backgroundColor:"black"}}>
                    <Text style={{fontWeight:600,color:"white"}}>Gender:</Text>
                    <Text style={{fontWeight:500,color:"white",opacity:0.6}}>{currentuser.gender}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsSelected("gender")} style={{margin:15,borderWidth:1,padding:9,borderRadius:10,width:"30%",alignItems:"center",backgroundColor:"black"}}>
                    <Text style={{fontSize:12,color:"white",fontWeight:600}}>
                        Change
                    </Text>
                </TouchableOpacity>
            </View>
            :
            <View style={{width:"100%",flexDirection:"column",alignItems:"center",padding:0}}>
                <TouchableOpacity onPress={() => setIsSelected(null)} style={{width:"100%",flexDirection:"row",alignItems:"center",padding:15,borderWidth:1,borderRadius:0,backgroundColor:"black"}}>
                    <MaterialCommunityIcons 
                        name="arrow-left"
                        color={"white"}
                        size={18}
                    />
                    <Text style={{color:"white",marginLeft:10,fontWeight:700}}>Back</Text>
                </TouchableOpacity>
                {
                    isSelected == "fullname" && 
                    <View style={{flexDirection:"column",justifyContent:"space-between",width:"80%",marginTop:80}}>
                        <Text style={{fontWeight:600,fontSize:16}}>
                            Your new name:  
                        </Text>
                        <Text style={{marginTop:10,fontSize:14,fontWeight:800}}>
                            {newName}
                        </Text> 
                        <TouchableOpacity onPress={() => handleSaveData(isSelected,newName)} style={{margin:15,borderWidth:1,padding:12,borderRadius:10,width:"100%",alignItems:"center",backgroundColor:"black",alignSelf:"center",marginTop:30}}>
                            <Text style={{fontSize:12,color:"white",fontWeight:600}}>
                                Save
                            </Text>
                        </TouchableOpacity>

                        <Diag_InpitField 
                            setInputValue={setNewName}
                            inputValue={newName}
                            handleSend={handleSaveData(isSelected,newName)}
                            sendOff
                        />
                    </View>
                    
                }
                {
                    isSelected == "birth_date" && 
                    <DateInputPage 
                    title={"When were you born ?"}
                    date={birthDate}
                    setProgress={() => handleSaveData(isSelected,birthDate)}
                    progress={0}
                    setBirthDate={setBirthDate} 
                    pageStyle={{height:"83%",marginTop:20}}
                />
                }
                {
                    isSelected == "gender" && 
                    <View style={{flexDirection:"column",justifyContent:"space-between",width:"100%",marginTop:10}}>
                    <SelectionPage
                        buttonAction={{type:"next",actionData:{progress:0,increment_value:0.2}}}
                        selectableOption={"box"}
                        selectableData={
                            [
                                {
                                    title:"Female",
                                    type:"female",
                                    icon:{
                                        type:"icon",
                                        metaData:{
                                            name:"gender-female",
                                            size:30,
                                            color:"magenta"
                                        }
                                    }
                                },
                                {
                                    title:"Male",
                                    type:"male",
                                    icon:{
                                        type:"icon",
                                        metaData:{
                                            name:"gender-male",
                                            size:30,
                                            color:"blue"
                                        }
                                    }
                                },                                                                                                                                                        
                            ]
                        }                    
                        setOptionValue={(e) =>{setNewGender(e)} }
                        optionValue={newGender}
                        pageTitle={"Select your gender ?"}
                        setProgress={() => handleSaveData(isSelected,newGender)}
                    />
                    </View>
                }
            </View>
        }
  
        </>
    )
}