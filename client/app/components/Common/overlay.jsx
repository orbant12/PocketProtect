import { View, Text,Image, TouchableOpacity, StyleSheet} from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import PagerView from "react-native-pager-view"
import { useState } from "react"

export const Overlay_1 = ({visible,pages,setOverlayVisible}) => {
    const [currentPage, setCurrentPage] = useState(0)
    const handlePagerScroll = (e) => {
        const page = Math.round(e.nativeEvent.position);
        setCurrentPage(page);
    }
    return(
        <>
        {visible &&
            <View style={{flex:1,position:"absolute",zIndex:30,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.8)",alignItems:"center",justifyContent:"center",padding:0}}>
                <View style={{width:"85%",height:"80%",backgroundColor:"white",borderRadius:30,alignItems:"center",justifyContent:"space-between",padding:10, borderColor:"magenta",borderWidth:3}}>
                <MaterialCommunityIcons 
                    name="close"
                    size={25}
                    style={{position:"absolute",right:20,top:20,zIndex:100}}
                    onPress={() => setOverlayVisible(!visible)}
                />
                <PagerComponent 
                    pages={pages}
                    currentPage={currentPage}
                    handlePagerScroll={handlePagerScroll}
                />
                <TouchableOpacity onPress={() => setOverlayVisible(!visible)} style={{width:"90%",justifyContent:"center",alignItems:"center",padding:10, borderWidth:2,borderRadius:100}}>
                    <Text style={{fontWeight:"600"}}>Close</Text>
                </TouchableOpacity>
                </View>
            </View>
        }
        </>
    )
}

const PagerComponent = ({
    pages,
    currentPage,
    handlePagerScroll
}) => {
    return(
        <>
            <PagerView onPageScroll={(e) => handlePagerScroll(e)} initialPage={0} style={{height:"80%",width:"100%",marginTop:0}}>
                {pages.map((data,index) => (
                    <Page 
                        text={data.text}
                        image={data.image}
                        key={index}
                    />
                ))}
            </PagerView>
            <View style={[pager_style.IndicatorContainer]}>   
                {pages.map((data,index) => (
                    <View key={index} style={[pager_style.Indicator, { opacity: currentPage === index ? 1 : 0.3 }]} />      
                ))}                                                                             
            </View>  
        </>
    )
}


const Page = ({
    text,
    image
}) => {
    return(
        <View style={{padding:20,height:"100%",borderWidth:0}}>
            <Image 
                style={{width:"100%",height:"75%",borderWidth:0}}
                source={image}
            />
            <Text style={{fontSize:20,fontWeight:"700",color:"black",marginTop:20,textAlign:"center"}}>{text}</Text>
        </View>
    )
}

const pager_style = StyleSheet.create({
    IndicatorContainer: {
        position:"absolute",
        bottom:45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        backgroundColor:"transparent",
        padding:15,    
        borderBottomLeftRadius:30,        
        borderBottomRightRadius:30,        
        marginTop:0,
        marginBottom:0,
        marginTop:0,
        width:"50%",
        alignSelf:"center"
    },
    Indicator: {
        width: 6,
        height: 6,
        backgroundColor: 'black',
        borderRadius: 3,
        marginHorizontal: 5,
    },
})