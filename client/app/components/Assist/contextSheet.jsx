import {BottomSheetModal} from '@gorhom/bottom-sheet';
import { StyleSheet,ScrollView, View} from 'react-native';
import { MedicalData_Box } from '../ProfilePage/medicalDataBox';
import { useState } from 'react';



export const ContextSheet = ({
    contextSheet,    
    isContextPanelOpen,
    setIsContextPanelOpen,    
  }) => {

    const [ contextToggles , setContextToggles ] = useState({
        useBloodWork:false,
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

    function ContextPanel(){
      return(      
        <View style={[Cstyles.container,{zIndex:30}]}>
          <ScrollView style={{width:"100%",marginLeft:"auto",marginRight:"auto",backgroundColor:"white",height:"100%",paddingTop:0}} showsVerticalScrollIndicator={false}>
            <View style={{width:"100%",alignItems:"center"}}>
            {ContextOptions.map((data,index)=>(
                <MedicalData_Box 
                    data={data}
                    index={index}
                    handleSwitch={handleSwitch}
                />
            ))
            }     
            </View>
          </ScrollView>
        </View>
      )
    }

    return(
        <BottomSheetModal
            ref={contextSheet}
            snapPoints={["80%"]}
            onChange={() => setIsContextPanelOpen(!isContextPanelOpen)}
            enablePanDownToClose={true}
            handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:40,color:"white",zIndex:20}}
            handleIndicatorStyle={{backgroundColor:"white"}}

        >
            {ContextPanel()}
        </BottomSheetModal>
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