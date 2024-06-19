import PagerView from "react-native-pager-view"
import { View, StyleSheet } from "react-native"
import { useState } from "react"


export const PagerComponent = ({
    pages,
    indicator_position,
    pagerStyle,
    dotColor
}) => {
    const [currentPage, setCurrentPage] = useState(0)
    const handlePagerScroll = (e) => {
        const page = Math.round(e.nativeEvent.position);
        setCurrentPage(page);
    }
    return(
        <>
            <PagerView onPageScroll={(e) => handlePagerScroll(e)} initialPage={0} style={[{height:"100%",width:"100%",marginTop:0},pagerStyle]}>
                {pages.map((data,index) => (
                    <View key={index}>
                        {data.pageComponent()}
                    </View>
                ))}
            </PagerView>
            <View style={[pager_style.IndicatorContainer,indicator_position]}>   
                {pages.map((data,index) => (
                    <View key={index} style={[pager_style.Indicator,{backgroundColor:dotColor}, { opacity: currentPage === index ? 1 : 0.3 }]} />      
                ))}                                                                             
            </View>  
        </>
    )
}

const pager_style = StyleSheet.create({
    IndicatorContainer: {
        position:"relative",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"transparent",
        borderBottomLeftRadius:30,        
        borderBottomRightRadius:30,        
        width:"50%",
        alignSelf:"center",
    },
    Indicator: {
        width: 6,
        height: 6,
        backgroundColor: 'black',
        borderRadius: 3,
        marginHorizontal: 5,
    },
})