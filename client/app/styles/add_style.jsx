import { StyleSheet } from "react-native";

export const ExpStyle = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        backgroundColor:"white",
        paddingTop:100,
        alignItems:"center",
        
    },
    section:{
        width:"100%",
        padding:0,
        maxWidth:"100%",
        borderWidth:0,
        flexWrap:"wrap",
        alignItems:"center",
        flexDirection:"row",
        justifyContent:"center",
        paddingBottom:20,
        borderBottomWidth:0.3
    },
    featureBox:{
        width:"90%",
        height:170,
        borderWidth:1,
        borderRadius:5,
        margin:10,
        flexDirection:"column",
        justifyContent:"space-between",
        padding:0,
        alignItems:"center",
        backgroundColor:"black"
    }
})
