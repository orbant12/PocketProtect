
import { View, Text,ScrollView ,StyleSheet,Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React,{useState,useEffect} from 'react';
const UserSavedPage = () => {

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


    useEffect(() => {
        setContextToggles({
            ...contextToggles,
            useBloodWork:true
        })
    },[])

return (
    <View style={{width:"100%",alignItems:"center"}}>
    {ContextOptions.map((data,index)=>(
        <View key={index} style={[Cstyles.contextBox, !data.stateName ? {backgroundColor:"magenta"} : {backgroundColor:"lightgreen"}]}>
        <View style={[Cstyles.cardRight, !data.stateName && {}]}>
        <View>
            {!data.stateName ? 
                <Text style={{color:"magenta",fontWeight:500,fontSize:10}}>Not added yet</Text>
            :
                <Text style={{color:"lightgreen",fontWeight:500,fontSize:10}}>Already Provided</Text>
            }      
            <Text style={{color:"white",fontWeight:700,fontSize:20}}>
                {data.title}
            </Text>
        </View>

        <Pressable style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:20,padding:8,justifyContent:"center",backgroundColor:"white"}, !data.stateName ? {borderColor:"magenta"} : {borderColor:"lightgreen"}]}>
        {data.stateName ?
            <Text style={{color:"black",marginRight:10,fontWeight:600}}>See Data</Text>
            :
            <Text style={{color:"black",marginRight:10,fontWeight:600}}>Add now </Text>
        }
            <MaterialCommunityIcons 
                name='arrow-right'
                color={!data.stateName? "magenta" : "lightgreen"}
                size={15}
            />
        </Pressable>
        </View>
        <View style={[Cstyles.cardLeft,  !data.stateName && {}]}>
            {data.stateName && 
            <>
                <Text style={{color:"white",fontSize:9,maxWidth:80,fontWeight:800,opacity:0.7}}>Last updated:</Text>
                <Text style={{color:"white",fontSize:10,maxWidth:70,marginTop:5,opacity:0.5}}>2003.11.17</Text>
            </>
            }        
        </View>
        </View>
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