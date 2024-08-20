import {BottomSheetModal} from '@gorhom/bottom-sheet';
import { StyleSheet,ScrollView, View, Pressable,Text} from 'react-native';
import { MedicalData_Box } from '../ProfilePage/medicalDataBox';
import { useState } from 'react';
import { ContextToggleType } from '../../utils/types';



export const ContextSheet = ({
    contextSheet,    
    isContextPanelOpen,
    setIsContextPanelOpen,    
  }) => {

    const [ contextToggles , setContextToggles ] = useState<ContextToggleType>({
        useBloodWork:false,
        useUvIndex:false,
        useMedicalData:false,
        useWeatherEffect:false,
    })

    const ContextOptions = [
        {
          title:"Blood Work",
          stateName:contextToggles.useBloodWork,
          stateID:"useBloodWork"
        },
        {
          title:"Weather Effects",
          stateName:contextToggles.useWeatherEffect,
          stateID:"useWeatherEffect"
        },
        {
          title:"Weather Effects",
          stateName:contextToggles.useWeatherEffect,
          stateID:"useWeatherEffect"
        },
        {
          title:"Weather Effects",
          stateName:contextToggles.useWeatherEffect,
          stateID:"useWeatherEffect"
        },
    ]

    const handleSwitch = (name,e) => {
        if ( name == "useBloodWork"){
        setContextToggles({
            ...contextToggles,
            [name]:e
        })
        }  else if ( name == "useWeatherEffect"){
        setContextToggles({
            ...contextToggles,
            [name]:e
        })
        }
    }


    return(
  <></>
    )
}


const Cstyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:0,
        width:'100%',
        alignItems:'center',
        position:"relative",
        height:"100%",
        zIndex:10
    },        
  });


  export function ContextPanel({
    contextToggles,
    setContextToggles,
    userContexts,
     setDataSelected
  }){


    const ContextOptions = [
      {
        title:"Blood Work",
        stateName:contextToggles.useBloodWork,
        stateID:"useBloodWork"
      },
      {
        title:"UV Index",
        stateName:contextToggles.useUvIndex,
        stateID:"useUvIndex"
      },
      {
        title:"Allergies",
        stateName:contextToggles.useMedicalData,
        stateID:"useMedicalData"
      },
      {
        title:"Weather Data",
        stateName:contextToggles.useWeatherEffect,
        stateID:"useWeatherEffect"
      },
    ]
    
    const handleSwitch = (name,e) => {
      if ( name == "useBloodWork"){
      setContextToggles({
          ...contextToggles,
          [name]:e
      })
      }  else if ( name == "useWeatherEffect"){
      setContextToggles({
          ...contextToggles,
          [name]:e
      })
      } else if ( name == "useMedicalData"){
        setContextToggles({
          ...contextToggles,
          [name]:e
      })
      } else if ( name == "useUvIndex"){
        setContextToggles({
          ...contextToggles,
          [name]:e
      })
      }

    }

    return(      
      <>
      <View style={[{width:"100%",backgroundColor:"rgba(0,0,0,1)",position:"relative",height:100,justifyContent:"center",alignItems:"center",paddingTop:0,paddingHorizontal:10},]}>
        <View style={{paddingTop:0, width:"100%"}}>
          <Text style={{fontWeight:"700",fontSize:20,width:"100%",color:"white",textAlign:"center",position:"relative"}}>
            <Text style={{color:"gray",fontWeight:"800",}}> Pick the data </Text>
            you want <Text style={{color:"gray",fontWeight:"800"}}>Ai</Text> to see during your assistance
          </Text> 
        </View>
      </View>
      <View style={[Cstyles.container,{zIndex:30}]}>
        <ScrollView contentContainerStyle={{paddingBottom:100}} style={{width:"100%",marginLeft:"auto",marginRight:"auto",backgroundColor:"white",height:"100%",paddingTop:0}} showsVerticalScrollIndicator={false}>
          <View style={{width:"100%",alignItems:"center"}}>
          {ContextOptions.map((data,index)=>(
              <MedicalData_Box 
                  data={data}
                  index={index}
                  handleSwitch={handleSwitch}
                  key={index}
                  avalible={userContexts[index].stateName != null}
                   setDataSelected={ setDataSelected}
              />
          ))
          }     
          </View>
        </ScrollView>
      </View>
      </>
    )
  }

  