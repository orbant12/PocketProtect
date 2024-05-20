
import { View,Text,TouchableOpacity,StyleSheet,Pressable,ScrollView,TextInput } from "react-native"
import React,{useEffect, useState,useRef} from "react"
import ProgressBar from 'react-native-progress/Bar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from "../../context/UserAuthContext";
import { saveBloodWork,fetchBloodWork } from "../../server"

const BloodWorkPage = ({navigation}) => {

    // Variable

    const { currentuser } = useAuth()

    const [progress , setProgress] = useState(0)

    const [ methodSelect ,setMethodSelect] = useState(false)

    const [ isSaveModalActive, setIsSaveModalActive] = useState(false)
    const [ saveCardModalActive, setSaveCardModalActive] = useState(false)



    const formattedDate = (date) => {
        const lastEditedDate = new Date(date)
        const year = lastEditedDate.getFullYear();
        const month = String( lastEditedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(lastEditedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}.${month}.${day}`;
        return formattedDate
    }

    const [ bloodWorkData, setBloodWorkData] = useState({
        Created_Date: "2001-08-25T23:15:00.000Z",
        basicHealthIndicators:{
            hemoglobin:0,
            hematocrit:0,
            red_blood_cell_count:0,
            white_blood_cell_count:0,
            platelet_count:0,
        },
        Lipid_Panel:{
            total_cholesterol:0,
            high_density_lipoprotein:0,
            low_density_lipoprotein:0,
            triglycerides:0
        },
        Metabolic_Panel:{
            glucose:0,
            blood_urea_nitrogen:0,
            creatinine:0,
            sodium:0,
            potassium:0,
            chloride:0,
            carbon_dioxide:0,
            calcium:0,
        },
        Liver_Function_Tests:{
            Alanine_Aminotransferase:0,
            Aspartate_Aminotransferase:0,
            Alkaline_Phosphatase:0,
            Bilirubin:0,
            Albumin:0,
            Total_Protein:0
        },
        Thyroid_Panel:{
            Thyroid_Stimulating_Hormone:0,
            Free_Thyroxine:0,
            Free_Triiodothyronine:0,
        },
        Iron_Studies:{
            Serum_Iron:0,
            Ferritin:0,
            Total_Iron_Binding_Capacity:0,
            Transferrin_Saturation:0,
        },
        Vitamins_and_Minerals:{
            Vitamin_D:0,
            Vitamin_B12:0,
            Folate:0
        },
        Inflammatory_Markers:{
            C_Reactive_Protein:0,
            Erythrocyte_Sedimentation_Rate:0,
        },
        Hormonal_Panel:{
            Testosterone:0,
            Estrogen:0,
            Progesterone:0
        }   
    })

    const dataFixed = [
        {
            q:"When did you recive your blood work results",
            component:DateInput()
        },
        {
            q:"Why did you decided to make your blood work",
            component:Why()
        },
        {
            q:"Basic Health Indicators",
            component:BloodWorkAddInput()
        },
        {
            q:"Lipid Panel",
            component:BloodWorkAddInput2()
        },
        {
            q:"Metabolic Panel",
            component:BloodWorkAddInput3()
        },
        {
            q:"Liver Function Tests",
            component:BloodWorkAddInput4()
        },
        {
            q:"Thyroid Panel",
            component:BloodWorkAddInput5()
        },
        {
            q:"Iron Studies",
            component:BloodWorkAddInput6()
        },
        {
            q:"Vitamins and Minerals",
            component:BloodWorkAddInput7({title:"Vitamins_and_Minerals"})
        },
        {
            q:"Inflammatory Markers",
            component:BloodWorkAddInput8({title:"Inflammatory_Markers"})
        },
        {
            q:"Hormonal Panel",
            component:BloodWorkAddInput9({title:"Hormonal_Panel"})
        },
        {
            q:"We are all done !",
            component:FinishPage()
        }
    ]


    // Function


    const onDateChange = (event, date) => {
        console.log(date)
          setBloodWorkData({
            ...bloodWorkData,
            Created_Date:(String(date))
          })
     };

    const handleDataChange = (title,type,e) => {
        if(title == "basicHealthIndicators"){
            setBloodWorkData(
                {  ...bloodWorkData,
                [title]:{
                    ...bloodWorkData.basicHealthIndicators,
                    [type]:e
                }}
            )
        } else if (title == "Lipid_Panel"){
            setBloodWorkData(
            {  ...bloodWorkData,
                [title]:{
                    ...bloodWorkData.Lipid_Panel,
                    [type]:e
                }}
            )
        } else if (title == "Metabolic_Panel"){
            setBloodWorkData(
                {  ...bloodWorkData,
                    [title]:{
                        ...bloodWorkData.Metabolic_Panel,
                        [type]:e
                    }}
                )
        } else if (title == "Liver_Function_Tests"){
            setBloodWorkData(
                {  ...bloodWorkData,
                    [title]:{
                        ...bloodWorkData.Liver_Function_Tests,
                        [type]:e
                    }}
                )
        } else if (title == "Thyroid_Panel"){
            setBloodWorkData(
                {  ...bloodWorkData,
                    [title]:{
                        ...bloodWorkData.Thyroid_Panel,
                        [type]:e
                    }}
                )
        } else if (title == "Iron_Studies"){
            setBloodWorkData(
                {  ...bloodWorkData,
                    [title]:{
                        ...bloodWorkData.Iron_Studies,
                        [type]:e
                    }}
                )
        } else if (title == "Vitamins_and_Minerals"){
            setBloodWorkData(
                {  ...bloodWorkData,
                    [title]:{
                        ...bloodWorkData.Vitamins_and_Minerals,
                        [type]:e
                    }}
                )
        } else if (title == "Inflammatory_Markers"){
            setBloodWorkData(
                {  ...bloodWorkData,
                    [title]:{
                        ...bloodWorkData.Inflammatory_Markers,
                        [type]:e
                    }}
                )
        } else if (title == "Hormonal_Panel"){
            setBloodWorkData(
                {  ...bloodWorkData,
                    [title]:{
                        ...bloodWorkData.Hormonal_Panel,
                        [type]:e
                    }}
                )
        }

    }

    const handleSaveProgress = async () => {
        const response = await saveBloodWork({
            userId: currentuser.uid,
            data: bloodWorkData
        })
        if ( response == true){
            navigation.goBack()
        }
    }

    const handleBack = (permission) => {
        if (progress == 0 || permission == true){
            navigation.goBack()
        } else {
            setProgress(progress - 1)
        }
    }

    const fetchBloodWorkData = async () => {
        const response = await fetchBloodWork({userId:currentuser.uid})
        if(response != false){
            setBloodWorkData(response)
        }

    }

    useEffect(()=> {     
        if (currentuser){
            fetchBloodWorkData()         
        }
    },[])


    // Components

    function DateInput(){ 
        return(
            <>          
            <DateTimePicker onChange={(e,d) => onDateChange(e,d)} value={new Date(bloodWorkData.Created_Date)} mode="date" style={{marginTop:0}} />
            {bloodWorkData.Created_Date == "2001-08-25T23:15:00.000Z" ?
            <Text style={{fontWeight:"600"}}>Last Updated: <Text style={{opacity:0.4}}>First Time</Text></Text>
            :
            <Text style={{fontWeight:"600"}}>Last Updated:<Text style={{opacity:0.4}}> {formattedDate(bloodWorkData.Created_Date)}</Text></Text>
            }
            </>
        )
    }

    function Why(){
        return(
            <Text style={{color:"black"}}>Hi</Text>
        )
    }

    function BloodWorkAddInput(){
        return(
            <View style={{width:"100%",alignItems:"center",justifyContent:"space-between",height:"60%"}}>

            {/* <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",width:"60%",zIndex:0, position:"relative",backgroundColor:"white",height:50,borderWidth:1,borderRadius:25,marginTop:20}}>
                <TouchableOpacity onPress={() => setMethodSelect(true)} style={methodSelect ? {borderBottomColor:"magenta",borderBottomWidth:2} : {}}>
                    <Text style={methodSelect?{fontWeight:"600",color:"black"}:{opacity:0.4,fontWeight:600,color:"black"}}>Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMethodSelect(false)} style={!methodSelect ? {borderBottomColor:"magenta",borderBottomWidth:2} : {}}>
                    <Text style={methodSelect?{opacity:0.4,fontWeight:600,color:"black"}:{fontWeight:"600",color:"black"}}>Manual</Text>
                </TouchableOpacity>
            </View>
            {methodSelect == true ? (
                <View style={{width:"100%",alignItems:"center",borderWidth:0,marginTop:50}}>
                    <TouchableOpacity style={{width:200,height:150,padding:0,backgroundColor:"white",alignItems:"center",justifyContent:"center",borderRadius:10,borderWidth:1,borderStyle:"dashed",opacity:0.6}}>
                        <MaterialCommunityIcons
                            name='camera'
                            color={"black"}
                            size={30}
                        />
                        <Text style={{color:"black",fontSize:15,fontWeight:"600",marginTop:20}}>Click to upload</Text>
                    </TouchableOpacity>
                </View>            
            ):(
                <ScrollView>
                    
                </ScrollView>
            )
            } */}
            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:0}}>
                <Text>Hemoglobin (Hgb)</Text>
                <View>        
                    <TextInput 
                        keyboardType="numeric"
                        style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                        value={`${bloodWorkData.basicHealthIndicators.hemoglobin}`}
                        onChangeText={(e) => handleDataChange("basicHealthIndicators","hemoglobin",e)}
                        textAlign="center"            
                    />                   
                </View> 
            </View>

            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:20}}>
                <Text>Hematocrit (Hct)</Text>
                <View>        
                    <TextInput 
                        keyboardType="numeric"
                        style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                        value={`${bloodWorkData.basicHealthIndicators.hematocrit}`}
                        onChangeText={(e) => handleDataChange("basicHealthIndicators","hematocrit", Number(e))}
                        textAlign="center"            
                    />                   
                </View> 
            </View>

            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:20}}>
                <Text>Red Blood Cell Count (RBC)</Text>
                <View>        
                    <TextInput 
                        keyboardType="numeric"
                        style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                        value={`${bloodWorkData.basicHealthIndicators.red_blood_cell_count}`}
                        onChangeText={(e) => handleDataChange("basicHealthIndicators","red_blood_cell_count",e)}
                        textAlign="center"            
                    />                   
                </View> 
            </View>

            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:20}}>
                <Text>White Blood Cell Count (WBC)</Text>
                <View>        
                    <TextInput 
                        keyboardType="numeric"
                        style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                        value={`${bloodWorkData.basicHealthIndicators.white_blood_cell_count}`}
                        onChangeText={(e) => handleDataChange("basicHealthIndicators","white_blood_cell_count",e)}
                        textAlign="center"            
                    />                   
                </View> 
            </View>

            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:20}}>
                <Text>Platelet Count (PLT)</Text>
                <View>        
                    <TextInput 
                        keyboardType="numeric"
                        style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                        value={`${bloodWorkData.basicHealthIndicators.platelet_count}`}
                        onChangeText={(e) => handleDataChange("basicHealthIndicators","platelet_count",e)}
                        textAlign="center"            
                    />                   
                </View> 
            </View>
        </View>
        )
    }

    function BloodWorkAddInput2(){
        return(
            <View style={{width:"100%",alignItems:"center",justifyContent:"space-between",height:"50%"}}>        
            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:0}}>
                <Text>Total Cholesterol</Text>
                <View>        
                    <TextInput 
                        keyboardType="numeric"
                        style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                        value={`${bloodWorkData.Lipid_Panel.total_cholesterol}`}
                        onChangeText={(e) => handleDataChange("Lipid_Panel","total_cholesterol",e)}
                        textAlign="center"            
                    />                   
                </View> 
            </View>

            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:20}}>
                <Text>High-Density Lipoprotein (HDL)</Text>
                <View>        
                    <TextInput 
                        keyboardType="numeric"
                        style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                        value={`${bloodWorkData.Lipid_Panel.high_density_lipoprotein}`}
                        onChangeText={(e) => handleDataChange("Lipid_Panel","high_density_lipoprotein",e)}
                        textAlign="center"            
                    />                   
                </View> 
            </View>

            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:20}}>
                <Text>Low-Density Lipoprotein (LDL)</Text>
                <View>        
                    <TextInput 
                        keyboardType="numeric"
                        style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                        value={`${bloodWorkData.Lipid_Panel.low_density_lipoprotein}`}
                        onChangeText={(e) => handleDataChange("Lipid_Panel","low_density_lipoprotein",e)}
                        textAlign="center"            
                    />                   
                </View> 
            </View>

            <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:20}}>
                <Text>Triglycerides</Text>
                <View>        
                    <TextInput 
                        keyboardType="numeric"
                        style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                        value={`${bloodWorkData.basicHealthIndicators.triglycerides}`}
                        onChangeText={(e) => handleDataChange("basicHealthIndicators","triglycerides",e)}
                        textAlign="center"            
                    />                   
                </View> 
            </View>
        </View>
        )
    }

    function BloodWorkAddInput3(){
        return(
            <ScrollView style={{width:"100%",marginTop:20,height:"100%"}}>
                <View style={{width:"100%",alignItems:"center",justifyContent:"space-between",height:"70%",marginBottom:30}}>        
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                    <Text>Glucose</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Metabolic_Panel.glucose}`}
                            onChangeText={(e) => handleDataChange("Metabolic_Panel","glucose",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Blood Urea Nitrogen (BUN)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Metabolic_Panel.blood_urea_nitrogen}`}
                            onChangeText={(e) => handleDataChange("Metabolic_Panel","blood_urea_nitrogen",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Creatinine</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Metabolic_Panel.creatinine}`}
                            onChangeText={(e) => handleDataChange("Metabolic_Panel","creatinine",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Sodium</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Metabolic_Panel.sodium}`}
                            onChangeText={(e) => handleDataChange("Metabolic_Panel","sodium",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Potassium</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Metabolic_Panel.potassium}`}
                            onChangeText={(e) => handleDataChange("Metabolic_Panel","potassium",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Chloride</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Metabolic_Panel.chloride}`}
                            onChangeText={(e) => handleDataChange("Metabolic_Panel","chloride",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Carbon Dioxide (CO2)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Metabolic_Panel.carbon_dioxide}`}
                            onChangeText={(e) => handleDataChange("Metabolic_Panel","carbon_dioxide",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Calcium</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Metabolic_Panel.calcium}`}
                            onChangeText={(e) => handleDataChange("Metabolic_Panel","calcium",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>
                </View>
            </ScrollView>
        )
    }

    function BloodWorkAddInput4(){
        return(
            <ScrollView style={{width:"100%",marginTop:20,height:"100%"}}>
                <View style={{width:"100%",alignItems:"center",justifyContent:"space-between",height:"70%",marginBottom:30}}>        
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                    <Text>Alanine Aminotransferase (ALT)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Liver_Function_Tests.Alanine_Aminotransferase}`}
                            onChangeText={(e) => handleDataChange("Liver_Function_Tests","Alanine_Aminotransferase",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Aspartate Aminotransferase (AST)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Liver_Function_Tests.Aspartate_Aminotransferase}`}
                            onChangeText={(e) => handleDataChange("Liver_Function_Tests","Aspartate_Aminotransferase",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Alkaline Phosphatase (ALP)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Liver_Function_Tests.Alkaline_Phosphatase}`}
                            onChangeText={(e) => handleDataChange("Liver_Function_Tests","Alkaline_Phosphatase",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Bilirubin (Total and Direct)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Liver_Function_Tests.Bilirubin}`}
                            onChangeText={(e) => handleDataChange("Liver_Function_Tests","Bilirubin",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Albumin</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Liver_Function_Tests.Albumin}`}
                            onChangeText={(e) => handleDataChange("Liver_Function_Tests","Albumin",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Total Protein</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Liver_Function_Tests.Total_Protein}`}
                            onChangeText={(e) => handleDataChange("Liver_Function_Tests","Total_Protein",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>
    
                </View>
            </ScrollView>
        )
    }

    function BloodWorkAddInput5(){
        return(
            <ScrollView style={{width:"100%",marginTop:20,height:"100%"}}>
                <View style={{width:"100%",alignItems:"center",justifyContent:"space-between",height:"70%",marginBottom:30}}>        
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                    <Text>Thyroid Stimulating Hormone (TSH)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Thyroid_Panel.Thyroid_Stimulating_Hormone}`}
                            onChangeText={(e) => handleDataChange("Thyroid_Panel","Thyroid_Stimulating_Hormone",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Free Thyroxine (Free T4))</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Thyroid_Panel.Free_Thyroxine}`}
                            onChangeText={(e) => handleDataChange("Thyroid_Panel","Free_Thyroxine",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Free Triiodothyronine (Free T3)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Thyroid_Panel.Free_Triiodothyronine}`}
                            onChangeText={(e) => handleDataChange("Thyroid_Panel","Free_Triiodothyronine",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>
                </View>
            </ScrollView>
        )
    }

    function BloodWorkAddInput6(){
        return(
            <ScrollView style={{width:"100%",marginTop:20,height:"100%"}}>
                <View style={{width:"100%",alignItems:"center",justifyContent:"space-between",height:"70%",marginBottom:30}}>        
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                    <Text>Serum Iron</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Iron_Studies.Serum_Iron}`}
                            onChangeText={(e) => handleDataChange("Iron_Studies","Serum_Iron",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Ferritin</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Iron_Studies.Ferritin}`}
                            onChangeText={(e) => handleDataChange("Iron_Studies","Ferritin",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Total Iron-Binding Capacity (TIBC)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Iron_Studies.Total_Iron_Binding_Capacity}`}
                            onChangeText={(e) => handleDataChange("Iron_Studies","Total_Iron_Binding_Capacity",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>


                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Transferrin Saturation</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData.Iron_Studies.Transferrin_Saturation}`}
                            onChangeText={(e) => handleDataChange("Iron_Studies","Transferrin_Saturation",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>
                </View>
            </ScrollView>
        )
    }

    function BloodWorkAddInput7({title}){
        return(
            <ScrollView style={{width:"100%",marginTop:20,height:"100%"}}>
                <View style={{width:"100%",alignItems:"center",justifyContent:"space-between",height:"70%",marginBottom:30}}>        
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                    <Text>Vitamin D (25-Hydroxy Vitamin D)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData?.[title].Vitamin_D}`}
                            onChangeText={(e) => handleDataChange(`${title}`,"Vitamin_D",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Vitamin B12</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData?.[title].Vitamin_B12}`}
                            onChangeText={(e) => handleDataChange(`${title}`,"Vitamin_B12",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Folate</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData?.[title].Folate}`}
                            onChangeText={(e) => handleDataChange(`${title}`,"Folate",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>
                </View>
            </ScrollView>
        )
    }

    function BloodWorkAddInput8({title}){
        return(
            <ScrollView style={{width:"100%",marginTop:20,height:"100%"}}>
                <View style={{width:"100%",alignItems:"center",justifyContent:"space-between",height:"70%",marginBottom:30}}>        
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                    <Text>C-Reactive Protein (CRP)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData?.[title].C_Reactive_Protein}`}
                            onChangeText={(e) => handleDataChange(`${title}`,"C_Reactive_Protein",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Erythrocyte Sedimentation Rate (ESR)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData?.[title].Erythrocyte_Sedimentation_Rate}`}
                            onChangeText={(e) => handleDataChange(`${title}`,"Erythrocyte_Sedimentation_Rate",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>      
                </View>
            </ScrollView>
        )
    }

    function BloodWorkAddInput9({title}){
        return(
            <ScrollView style={{width:"100%",marginTop:20,height:"100%"}}>
                <View style={{width:"100%",alignItems:"center",justifyContent:"space-between",height:"70%",marginBottom:30}}>        
                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                    <Text>Testosterone (Total and Free)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData?.[title].Testosterone}`}
                            onChangeText={(e) => handleDataChange(`${title}`,"Testosterone",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Estrogen (Estradiol)</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData?.[title].Estrogen}`}
                            onChangeText={(e) => handleDataChange(`${title}`,"Estrogen",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>

                <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
                    <Text>Progesterone</Text>
                    <View>        
                        <TextInput 
                            keyboardType="numeric"
                            style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10}}                   
                            value={`${bloodWorkData?.[title].Progesterone}`}
                            onChangeText={(e) => handleDataChange(`${title}`,"Progesterone",e)}
                            textAlign="center"            
                        />                   
                    </View> 
                </View>     
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
                <View style={{marginTop:60,alignItems:"center"}}>  
                    <Text style={{marginBottom:10,fontWeight:"700",fontSize:23,backgroundColor:"white"}}>Why complete this report ?</Text>
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
                <Pressable onPress={() => setProgress(1)} style={[styles.startButton,{marginBottom:10}]}>
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
                            <TouchableOpacity style={{backgroundColor:"white",padding:10,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:20}} onPress={() =>  handleSaveProgress()}>
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
                            <TouchableOpacity style={{backgroundColor:"white",padding:10,borderRadius:10,borderWidth:1,alignItems:"center",marginLeft:70}} onPress={() => {setSaveCardModalActive(!saveCardModalActive);setIsSaveModalActive(!isSaveModalActive)}}>
                                <Text style={{color:"black",fontWeight:"500"}}>Save</Text>
                            </TouchableOpacity>    
                            <TouchableOpacity style={{backgroundColor:"red",padding:10,borderRadius:10,alignItems:"center",}} onPress={() => handleBack(true)}>
                                <Text style={{color:"white",fontWeight:"600"}}>Exit</Text>
                            </TouchableOpacity>                      
                        </View> 
                    </View>
                </View>
            }
            </>
        )
    }


    return(
        <>
        {ExitModal({isSaveModalActive})}
        {SaveModal({saveCardModalActive})}
        <View style={styles.container}>
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
            {progress == 0 ?
            FirstScreen()                
            :
            <View style={{width:"100%",alignItems:"center",height:"90%",justifyContent:"space-between",marginTop:55,borderWidth:0}}>
                <View style={{width:"90%",alignItems:"center",backgroundColor:"#eee",justifyContent:"center",padding:20,borderRadius:20,marginTop:10}}>
                    <Text style={{fontWeight:"700",fontSize:"20",width:"100%",textAlign:"center"}}>{dataFixed[progress - 1].q}</Text>            
                </View> 
                {dataFixed[progress-1].component}
                    {progress == dataFixed.length ?
                        <Pressable onPress={() => handleSaveProgress()} style={[styles.startButton,{marginBottom:10}]}>                        
                            <Text style={{padding:14,fontWeight:"600",color:"white"}}>Finsih</Text>
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
        backgroundColor:"white"
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