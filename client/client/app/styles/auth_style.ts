import { StyleSheet } from "react-native"


export const l_styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    paper: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 0,
        backgroundColor: 'white',
        justifyContent:"space-between"
    },
    //TITLE
    titleSection:{
            width:'100%',
            flexDirection:'column',
            justifyContent:"flex-start",
            alignItems:'flex-start',
            maxWidth:150,
            marginTop:40,
            marginLeft:20,
            marginBottom: 20,
            borderColor:'black',
        },
    title: {
        fontSize: 32,
        alignSelf: 'center',
        fontWeight:"700",
    },
    //INPUT FIELDS
    inputArea:{
        width:'100%',
        height:200,
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:50,
        borderColor:'black',
    },
    text: {
        fontSize: 20,
        marginLeft:50,
    },
    button: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 50,
        padding: 20,
    },
    buttonTitle: {
        fontSize: 20,
        color: 'white',
        fontWeight: "600",
        alignSelf: 'center',
    },
    inputFieldContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'85%',
        alignSelf:'center',
        backgroundColor:'white',
        borderColor:'black',
        borderWidth:0.3,
        borderRadius:10,
        padding:20,
        fontSize:20,
        fontWeight:"500"
    },
    inputField:{
        alignSelf:'center',
        width:'90%',
        backgroundColor:'white',
        borderColor:'black',
        borderRadius:50,
        padding:0,
        fontSize:20,
        fontWeight:"500",
        marginLeft:13
    },
    //FORGOT PASSWORD
    forgotPassRow:{
        flexDirection:'row-reverse',
        justifyContent:'space-between',
        width:'90%',
    },
    
    bottomText:{
        flexDirection:'row',
        justifyContent:'center',
        marginBottom:30
    },
})

export const r_styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    paper: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 0,
        backgroundColor: 'white',
        justifyContent:"space-between"
    },
    //TITLE
    titleSection:{
            width:'100%',
            flexDirection:'column',
            justifyContent:"flex-start",
            alignItems:'flex-start',
            maxWidth:200,
            marginTop:50,
            borderColor:'black',
        },
    title: {
        fontSize: 32,
        alignSelf: 'center',
        fontWeight:"500",
    },
    //INPUT FIELDS
    inputArea:{
        width:'100%',
        height:250,
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:20,
        borderColor:'black',
    },
    text: {
        fontSize: 20,
        marginLeft:50,
    },
    button: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 50,
        padding: 20,
    },
    buttonTitle: {
        fontSize: 20,
        color: 'white',
        fontWeight: "600",
        alignSelf: 'center',
    },
    inputFieldContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'85%',
        alignSelf:'center',
        backgroundColor:'white',
        borderColor:'black',
        borderWidth:0.3,
        borderRadius:10,
        padding:20,
        fontSize:20,
        fontWeight:"500"
    },
    inputField:{
        alignSelf:'center',
        width:'90%',
        backgroundColor:'white',
        borderColor:'black',
        borderRadius:50,
        padding:0,
        fontSize:20,
        fontWeight:"500",
        marginLeft:13
    },
        bottomText:{
            flexDirection:'row',
            justifyContent:'center',
            marginBottom:30
        },
})