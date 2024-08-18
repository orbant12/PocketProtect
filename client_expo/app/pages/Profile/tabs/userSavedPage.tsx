
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

      const [userContexts, setUserContexts] = useState({
        useBloodWork:null,
        useUvIndex:locationPermissionGranted ? (weatherData != null ? `UV Index: ${weatherData.uvi}` : null) : null,
        useMedicalData:null,
        useWeatherEffect:weatherData != null ? convertWeatherDataToString(weatherData) : null,
      })

      const ContextOptions:{title:string,stateName:any,stateID:selectableDataTypes}[] = [
        {
          title:"Blood Work",
          stateName:userContexts.useBloodWork,
          stateID:"useBloodWork"
        },
        {
          title:"Uv Index",
          stateName:userContexts.useUvIndex,
          stateID:"useUvIndex"
        },
        {
          title:"Allergies",
          stateName:userContexts.useMedicalData,
          stateID:"useMedicalData"
        },
        {
          title:"Weather Effects",
          stateName:userContexts.useWeatherEffect,
          stateID:"useWeatherEffect"
        },
      ]


      const handleAllergiesFetch = async () => {
        const response: {"allergiesArray": string[]} = await fetchAllergies({
          userId: currentuser.uid
        })
        if (response.allergiesArray.length > 0){
          setUserContexts({
            ...userContexts,
            useMedicalData:[...response.allergiesArray]
          })
        } else if (response.allergiesArray.length == 0){ 
          setUserContexts({
            ...userContexts,
            useMedicalData:null
          })
        }
      }

      const handleBloodWorkFetch = async () => {
        const bloodObj = new BloodWork(currentuser.uid);
        await bloodObj.fetchBloodWorkData()
        const response : BloodWorkDoc = bloodObj.getBloodWorkData()
        if (response != null){
          setUserContexts({
            ...userContexts,
            useBloodWork:response
          })
        } 
      }

      const fetchContextDatas = async () => {
        await handleAllergiesFetch()
        await handleBloodWorkFetch()
      }
    
    useEffect(() => {
      fetchContextDatas()
    },[])

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
      userContexts={userContexts}
      setUserContexts={setUserContexts}
      handleAllergiesFetch={handleAllergiesFetch}
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
  userContexts:{
    useBloodWork:any,
    useUvIndex:any,
    useMedicalData:any,
    useWeatherEffect:any
  },
  setUserContexts:React.Dispatch<React.SetStateAction<UserContextType>>;
  handleAllergiesFetch:Function
}) => {
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
          allergiesData={userContexts["useMedicalData"] == null ? [] : userContexts["useMedicalData"]}
          setAllergiesData={(data) => setUserContexts({...userContexts,useMedicalData:data})}
        />
      }
      {selectedData == "useBloodWork" &&
        <SingleBloodAnalasis
          bloodSelected={userContexts["useBloodWork"]}
        />
      }
    </Modal>
  )
}

