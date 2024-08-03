
import { View, Text,ScrollView ,StyleSheet,Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React,{useState,useEffect} from 'react';
import { useWeather } from '../../../context/WeatherContext';
import { UserContextType } from '../../../utils/types';
import { fetchBloodWork } from '../../../services/server';
import { useAuth } from '../../../context/UserAuthContext';
import { convertWeatherDataToString } from '../../../utils/melanoma/weatherToStringConvert';
import { styles } from '../../../styles/chatBot_style';


const UserSavedPage = () => {

    const { weatherData } = useWeather()
    const { currentuser } = useAuth()

    const [ contextToggles , setContextToggles ] = useState({
        useBloodWork:false,
        useUvIndex:false,
        useMedicalData:false,
        useBMI:false,
        useWeatherEffect:false,
      })

      const [userContexts, setUserContexts] = useState({
        useBloodWork:null,
        useUvIndex:weatherData != null ? `UV Index: ${weatherData.uvi}` : null,
        useMedicalData:null,
        useBMI:null,
        useWeatherEffect:weatherData != null ? convertWeatherDataToString(weatherData) : null,
      })


      const ContextOptions = [
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
          title:"Medical Data",
          stateName:userContexts.useMedicalData,
          stateID:"useMedicalData"
        },
        {
          title:"BMI",
          stateName:userContexts.useBMI,
          stateID:"useBMI"
        },
        {
          title:"Weather Effects",
          stateName:userContexts.useWeatherEffect,
          stateID:"useWeatherEffect"
        },
      ]

      const fetchContextDatas = async () => {
        const response = await fetchBloodWork({
          userId: currentuser.uid
        })
        if (response != null){
          setUserContexts({
            ...userContexts,
            useBloodWork:response
          })
        } 
      }


    useEffect(() => {
      fetchContextDatas()
    },[])

return (
    <View style={{width:"100%",alignItems:"center"}}>
    {ContextOptions.map((data,index)=>(
      <>
      {data.stateName != null ?
        (
          <View key={index} style={[Cstyles.contextBox,{backgroundColor:"lightgreen"}]}>
          <View style={[Cstyles.cardRight, !data.stateName && {}]}>
          <View>
              <Text style={{color:"lightgreen",fontWeight:"500",fontSize:10}}>Provided</Text>
              <Text style={{color:"white",fontWeight:"700",fontSize:20}}>
                  {data.title}
              </Text>
          </View>
  
          <Pressable style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:5,padding:8,justifyContent:"center",backgroundColor:"white"}, {borderColor:"lightgreen"}]}>
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
                  <Text style={{color:"white",fontSize:9,maxWidth:80,fontWeight:"800",opacity:0.7}}>Last updated:</Text>
                  <Text style={{color:"white",fontSize:10,maxWidth:70,marginTop:5,opacity:0.5}}>2003.11.17</Text>
              </>
              
          </View>
          </View>
        ):(
          <View key={index} style={[styles.contextBox, {backgroundColor:"rgba(255,0,0,0.7)"} ]}>
            <View style={[styles.cardRight, !data.stateName && {}]}>
              <View>

                <Text style={{color:"white",fontWeight:"500",fontSize:10}}>Not added yet !</Text>
                

                <Text style={{color:"rgba(255,0,0,0.8)",fontWeight:"700",fontSize:20}}>
                  {data.title}
              </Text>
              </View>
              <Pressable style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:5,padding:8,justifyContent:"center",backgroundColor:"white"}, !data.stateName ? {borderColor:"magenta"} : {borderColor:"lightgreen"}]}>
                  <Text style={{color:"black",marginRight:10,fontWeight:"600"}}>Add Data To Access</Text>
                  <MaterialCommunityIcons 
                    name='arrow-right'
                    color={"rgba(255,0,0,1)"}
                    size={15}
                  />
              </Pressable>
            </View>
            <View style={[styles.cardLeft,  !data.stateName && {}]}>
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
      </>
  
    ))
    }   
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