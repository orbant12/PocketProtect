import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        //LINEAR GRADIENT MAGENTA TO WHITE
        backgroundColor: 'white',
        flexDirection: 'column',
        paddingTop:50,
    },
    DataSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.95)', 
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        padding: 10,
        paddingBottom:20,
        borderRadius:5,
        width: '95%',
        marginTop: 20,
        marginLeft:"auto",
        marginRight:"auto",
        justifyContent: 'center',
        flex:1
    },
    TodaySection: {
        backgroundColor: 'rgba(0, 0, 0, 0.95)', 
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
        paddingBottom:20,
        borderRadius:3,
        width: '95%',
        marginTop: 20,
        marginLeft:"auto",
        marginRight:"auto",
        justifyContent: 'center',
        borderWidth:5,
        borderColor:"white"
        
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color:"white",
        margin: 10,
    },
    titleLeft: {
        fontSize: 11,
        opacity: 0.5,
        fontWeight: "100",
        margin: 10,
        color:"white",
    },
    TaskTitle: {
        fontSize: 16,
        fontWeight: "700",
        color:"#f2f2f2"
    },
    TaskSubTitle: {
        fontSize: 14,
        color: '#7a7a7a',
        marginTop:10,
        maxWidth:"90%",
        textAlign:"left"        
    },
    StartButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    TaskBox: {
        width:"95%",
        padding: 10,
        backgroundColor: '#1a1a1a', 
        margin: 10,
        justifyContent:"center",
        borderRadius: 10,  
      },
      DataBox: {
        width:300,
        padding: 13,
        backgroundColor: '#1a1a1a',         
        borderRadius: 10,  
        marginRight:"auto",
        marginLeft:"auto"
      },
      IndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
      },
      Indicator: {
        width: 6,
        height: 6,
        backgroundColor: 'white',
        borderRadius: 3,
        marginHorizontal: 5,
      },

});