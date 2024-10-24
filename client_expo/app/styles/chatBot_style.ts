import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flexDirection: 'column',
        paddingTop:0,
        width:'100%',
        alignItems:'center',
        position:"relative",
        zIndex:0,
        backgroundColor:"white"
    },
    assistantTitle:{
      flexDirection:'column',
      justifyContent:'center',
      padding:20,
      width:'100%',
      borderWidth:0,
    },
    assistantQuestionsContainer:{
      flexDirection:'column',    
      width:'200%',
      height:"100%",
      maxWidth:'100%',
      marginTop:0,
      justifyContent:'center',
      alignItems:'center',
      borderWidth:0,
    },
    assistantQuestionBox:{
      width:150,
      height:0,
      borderWidth:1,
      margin:10,
      borderRadius:1,
      flexDirection:'column',
      justifyContent:'space-between',
      alignItems:'center',
      padding:10,
      opacity:0.6,
    },
    inputContainerNotActive:{
      width:'100%',
      flexDirection:'row',
      padding:20,
      borderWidth:0,
      alignItems:'center',
      justifyContent:'center',
      position:'absolute',
      bottom:0,
      height:110,
      zIndex:0,
      backgroundColor:"transparent"
    },
    inputContainerActive:{
      width:'100%',
      padding:20,
      borderWidth:1,
      alignItems:'flex-start',
      justifyContent:'center',
      position:'absolute',
      bottom:0,
      backgroundColor:'white',
      flexDirection:'row',
      height:"41%",
      zIndex:20
    },
    inputField:{
      width:'80%',
      height:45,
      borderWidth:0.3,
      borderRadius:5,
      padding:10,
      zIndex:5,
    },
    horizontalQuBox:{
      backgroundColor:'black',
      borderRadius:5,
      height:40,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'column',
      marginTop:0,
      marginBottom:0,
      opacity:1,
      width:"80%"
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
    searchInputContainer:{
      flexDirection:"row",
      alignItems:"center",
      borderWidth:2,
      width:"80%",
      marginTop:50,
      borderRadius:10,
      padding:10,
      justifyContent:"center",
    },
    searchInput:{
      borderWidth:0,
      width:"70%",
      marginLeft:20,
    },
    addInputContainer:{
      flexDirection:"row",
      alignItems:"center",
      borderWidth:1,
      width:"50%",
      marginTop:40,
      borderRadius:50,
      padding:12,
      backgroundColor:"black",
      justifyContent:"center"
    },
    loadingModal:{
      alignItems:"center",
      flexDirection:"column",
      justifyContent:"center",
      position:"absolute",
      width:"100%",
      height:"50%",
      backgroundColor: "rgba(0, 0, 0, 0)",
      top:0,
      borderWidth:0
  },
  });