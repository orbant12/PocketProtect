import { StyleSheet } from "react-native"

export const AssistPanel_style = StyleSheet.create({
    sessionBar:{
        width:"100%",
        padding:15,
        borderRadius:0,
        borderBottomWidth:0,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        marginVertical:0

    },
    container:{
        alignItems:"center",
        marginTop:0
    },
    activeBubble:{
        padding:10,
        paddingHorizontal:20,
        backgroundColor:"rgba(0,0,0,0.3)",
        borderRadius:100
    },
    disabledBubble:{
        backgroundColor:"rgba(0,0,0,0.1)",
        padding:10,
        paddingHorizontal:20,
        borderRadius:100
    }
})