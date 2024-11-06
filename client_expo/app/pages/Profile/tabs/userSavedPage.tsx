
import { View, Text,ScrollView ,StyleSheet,Pressable, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React,{useState,useEffect} from 'react';
import { useWeather } from '../../../context/WeatherContext';
import { UserContextType } from '../../../utils/types';
import { BloodWorkData, BloodWorkDoc, fetchAllergies, fetchBloodWork } from '../../../services/server';
import { useAuth } from '../../../context/UserAuthContext';
import { convertWeatherDataToString } from '../../../utils/melanoma/weatherToStringConvert';
import { styles } from '../../../styles/chatBot_style';
import { Modal } from 'react-native';
import { Navigation_AddBloodWork } from '../../../navigation/navigation';
import { UviWidget } from '../../../components/Widgets/uviWidget';
import { WeatherData_Default } from '../../../utils/initialValues';
import moment from 'moment';
import { DateToString } from '../../../utils/date_manipulations';
import { WeatherWidget } from '../../../components/Widgets/weatherWidget';
import { MedicalData_Add_View } from '../../../components/ExplainPages/medicalData';
import { BloodWork } from '../../../models/BloodWork';
import { SingleBloodAnalasis } from '../../Libary/BloodCenter/bloodCenter';
import { ContextPanelData } from '../../../models/ContextPanel';

export type selectableDataTypes = "useBloodWork" | "useUvIndex" | "useMedicalData" | "useWeatherEffect";

export const generateTodayForWidget = () => {
  const todayDate: Date = new Date();
  const date = DateToString(todayDate);
  const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? moment(date).format('dd'):moment(date).format('dd')
  const withoutYear = moment(date).format('DD.MM');
  const today = day + " " + withoutYear; 
  return today
}

const UserSavedPage = ({navigation}) => {

    const { weatherData, locationString, locationPermissionGranted } = useWeather()
    const { currentuser } = useAuth()
    const [selectedData, setSelectedData] = useState<selectableDataTypes>(null)
    const [contextObj, setContextObj] = useState(new ContextPanelData("",{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted}));
    const [ContextOptions, setContextOptions] = useState<{title:string,stateName:any,stateID:selectableDataTypes}[]>([])

      const fetchContextDatas = async () => {
        await contextObj.loadContextData()
        const response = contextObj.getContextOptions()
        setContextOptions(response)
        console.log(response)
      }
    
    useEffect(() => {
      fetchContextDatas()
    },[])  

    useEffect(() => {
      if(currentuser){
          setContextObj(new ContextPanelData(currentuser.uid,{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted}));
      } else {
          setContextObj(new ContextPanelData("",{weatherData:weatherData,locationString:locationString,locationPermissionGranted:locationPermissionGranted}));
      }
  }, [currentuser]);

    const handleContextDataChange = async (field:selectableDataTypes,data:any[]) => {
      console.log(field,data)
      await contextObj.setContextOptions(field,data)
      const response = contextObj.getContextOptions()
      console.log(response)
      setContextOptions(response)
    }

return (
    <View style={{width:"100%",alignItems:"center"}}>
    {ContextOptions.map((data,index)=>(
      <View key={index} style={{width:"100%",alignItems:"center"}}>
      {data.stateName != null ?
        (
          <View  style={[Cstyles.contextBox,{backgroundColor:"lightgreen"}]}>
          <View style={[Cstyles.cardRight, !data.stateName && {}]}>
          <View>
              <Text style={{color:"lightgreen",fontWeight:"500",fontSize:10}}>Provided</Text>
              <Text style={{color:"white",fontWeight:"700",fontSize:20}}>
                  {data.title}
              </Text>
          </View>
  
          <Pressable onPress={() => setSelectedData(data.stateID)} style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:5,padding:8,justifyContent:"center",backgroundColor:"white"}, {borderColor:"lightgreen"}]}>
              <Text style={{color:"black",marginRight:10,fontWeight:"600"}}>See Data</Text>
              <MaterialCommunityIcons 
                  name='arrow-right'
                  color={"lightgreen"}
                  size={15}
              />
          </Pressable>
          </View>
          <View style={[Cstyles.cardLeft,!data.stateName && {}]}>
              <>
                  {data.stateID == "useBloodWork" ?
                  <>
                    <Text style={{color:"white",fontSize:9,maxWidth:80,fontWeight:"800",opacity:0.7}}>Last updated:</Text>
                    <Text style={{color:"white",fontSize:10,maxWidth:70,marginTop:5,opacity:0.5}}>{data.stateName.created_at}</Text>
                  </>
                    :
                    <Text style={{color:"white",fontSize:10,maxWidth:70,marginTop:5,opacity:0.5}}></Text>
                  }
              </>
          </View>
          </View>
        ):(
          <View  style={[styles.contextBox, {backgroundColor:"rgba(255,0,0,0.7)"} ]}>
            <View style={[styles.cardRight, !data.stateName && {}]}>
              <View>

                <Text style={{color:"white",fontWeight:"500",fontSize:10}}>Not added yet !</Text>
                

                <Text style={{color:"rgba(255,0,0,0.8)",fontWeight:"700",fontSize:20}}>
                  {data.title}
                </Text>
              </View>
              <Pressable 
                onPress={() => data.stateID == "useBloodWork" ? 
                  Navigation_AddBloodWork({navigation:navigation,type:"first"}) : setSelectedData(data.stateID)
                }
                style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:5,padding:8,justifyContent:"center",backgroundColor:"white"}, !data.stateName ? {borderColor:"magenta"} : {borderColor:"lightgreen"}]}
              >
                  <Text style={{color:"black",marginRight:10,fontWeight:"600"}}>Add Data To Access</Text>
                  <MaterialCommunityIcons 
                    name='arrow-right'
                    color={"rgba(255,0,0,1)"}
                    size={15}
                  />
              </Pressable>
            </View>
            <View style={[styles.cardLeft,!data.stateName && {}]}>
              <MaterialCommunityIcons 
                name='lock'
                color={"white"}
                style={{opacity:0.8}}
                size={24}
              />
            </View>
            </View>
        )
      }
      </View>
  
    ))
    }

    <DataModal 
      selectedData={selectedData}
      setSelectedData={setSelectedData}
      uviData={
        {
          locationString:locationString,
          weatherData:weatherData,
          today:generateTodayForWidget(),
          locationPermissionGranted:locationPermissionGranted
        }
      }
      userContexts={ContextOptions}
      setUserContexts={(field,data) => handleContextDataChange(field,data)}
      handleAllergiesFetch={fetchContextDatas}
    />

    </View>
)}



const Cstyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:0,
        width:'100%',
        alignItems:'center',
        position:"relative",
        height:"100%"
    },
    contextBox:{
        height:160,
        width:"90%",
        marginTop:40,
        borderRadius:20,
        flexDirection:"row",
        alignItems:"flex-end",
        justifyContent:"center"
      },
      cardRight:{
        width:"72%",
        height:"90%",
        borderRightWidth:10,
        backgroundColor:"black",
        borderRadius:10,
        borderTopRightRadius:0,
        borderTopLeftRadius:0,
        borderBottomRightRadius:0,
        padding:20,
        justifyContent:"space-between"
      },
      cardLeft:{
        padding:8,
        alignItems:"center",
        width:"28%",
        height:"100%",
        borderTopLeftRadius:20,
        borderTopRightRadius:15,
        borderBottomRightRadius:10,
        backgroundColor:"black"
      },
  });

export default UserSavedPage;


export const DataModal = ({selectedData,setSelectedData,uviData,userContexts,setUserContexts,handleAllergiesFetch}:{
  selectedData:selectableDataTypes,
  setSelectedData:React.Dispatch<React.SetStateAction<selectableDataTypes>>,
  uviData:{
    locationString:string,
    weatherData:any,
    today:string,
    locationPermissionGranted:boolean
  }
  userContexts:{title:string,stateName:any,stateID:selectableDataTypes}[],
  setUserContexts:any;
  handleAllergiesFetch:Function
}) => {

  const medicalDataIndex = userContexts.findIndex((option) => option.stateID === "useMedicalData")
  const bloodWorkIndex = userContexts.findIndex((option) => option.stateID === "useBloodWork")

  return (
    <Modal presentationStyle="formSheet" animationType='slide' visible={selectedData != null}>
        <TouchableOpacity onPress={() =>setSelectedData(null)} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.86)",borderWidth:2,borderColor:"gray",paddingVertical:10,borderRadius:10,width:"100%",alignSelf:"center",borderBottomLeftRadius:0,borderBottomRightRadius:0}}>
          <MaterialCommunityIcons 
            name='close'
            size={25}
            color={"white"}
          />
          <Text style={{color:"white",fontWeight:"800",fontSize:16,marginLeft:10,marginRight:10}}>Close</Text>
        </TouchableOpacity>
      {selectedData == "useUvIndex" && 
      <ScrollView contentContainerStyle={{paddingBottom:50}} style={{width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.1)"}} >
          <UviWidget 
            weatherData={uviData.locationPermissionGranted ? (uviData.weatherData != null ? uviData.weatherData : WeatherData_Default) : false}
            today={uviData.today}
            location={uviData.locationString}
          />
      </ScrollView>
      }
      {selectedData == "useWeatherEffect" && 
            <ScrollView contentContainerStyle={{paddingBottom:50}} style={{width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.1)"}} >
              <WeatherWidget 
                weatherData={uviData.locationPermissionGranted ? (uviData.weatherData != null ? uviData.weatherData : WeatherData_Default) : false}
                today={uviData.today}
                location={uviData.locationString}
              />
          </ScrollView>
      }
      {selectedData == "useMedicalData" &&
        <MedicalData_Add_View 
          handleClose={(e:"save" | "back") => {e != "save" ? setSelectedData(null) : setSelectedData(null),handleAllergiesFetch()}}
          allergiesData={userContexts[medicalDataIndex].stateName == null ? [] : userContexts[medicalDataIndex].stateName.allergiesArray}
          setAllergiesData={(data) => setUserContexts("useMedicalData",data)}
        />
      }
      {selectedData == "useBloodWork" &&
        <SingleBloodAnalasis
          bloodSelected={userContexts[bloodWorkIndex].stateName == null ? null : userContexts[bloodWorkIndex].stateName}
        />
      }
    </Modal>
  )
}

