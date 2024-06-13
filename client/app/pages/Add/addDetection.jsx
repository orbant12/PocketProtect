import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import React, {useState} from 'react';
import { Text,View,TouchableOpacity,Dimensions ,Image,Modal} from 'react-native';
import tutorial1 from "../../assets/diagnosis/first.png"
import PagerView from 'react-native-pager-view';
import { Horizontal_Navbar } from '../../components/LibaryPage/mainNav';
import { ExploreView } from '../../components/AddPage/exploreView';
import { styles } from "../../styles/add_style";
import { Navigation_MoleUpload_1,Navigation_MelanomaFullsetup } from "../../navigation/navigation";

const { width } = Dimensions.get('window');

const AddDetection = ({navigation}) => {

//<==================<[ Variable ]>====================>  

//NAV
const [headerSelect, setHeaderSelect] = useState("melanoma")
//DIAGNOSIS
const [selected, setSelected ] = useState([]) // IF It's empty array modal wont show
//H-SWIPE
const [currentPage, setCurrentPage] = useState(0);

//<==================<[ Functions ]>====================>  


const handleAction = (action) => {
    if (action == "Full_Melanoma_Navigation"){
        Navigation_MelanomaFullsetup({navigation})
    } else if (action == "Manual_Melanoma_Navigation"){
        Navigation_MoleUpload_1({
            navigation
        })
    }
    setSelected([])
}

const handleScrollReminder = (e) => {
    const page = Math.round(e.nativeEvent.position);
    setCurrentPage(page);
}

//<==================<[ Main Return ]>====================> 

    return(
        <View style={styles.container}>
                    <Horizontal_Navbar
                        setIsSelected={setHeaderSelect}
                        isSelected={headerSelect}
                        absolute={true}
                        options={[
                            {
                                title:"AI Vision",
                                value:"melanoma",
                            },
                            {
                                title:"Blood Analasis",
                                value:"blood_work",
                            },
                        ]}
                    />       
                    <ExploreView 
                        navigation={navigation}
                        setSelected={setSelected}
                    />

                    <Modal visible={selected.length != 0}>
                        <Explain_NavBar 
                            setSelected={setSelected}
                        />
                        <ExplainPanel 
                            handleAction={handleAction}
                            handleScrollReminder={handleScrollReminder}
                            selected={selected}
                            currentPage={currentPage}
                            actions={selected}
                        />
                    </Modal>    
        </View>
    )}

export default AddDetection;



function ExplainPanel({actions,handleScrollReminder,currentPage,handleAction}){
    return(
        <View style={{width:"100%",alignItems:"center",height:"80%",justifyContent:"space-between",marginTop:100}}>   
            <View style={{width:"100%",borderTopWidth:0}}>  
            <View style={{height:"70%",width:"100%",borderBottomWidth:3,borderTopWidth:0.3}}>                    
                <PagerView style={{width:"100%",height:"100%"}} onPageScroll={(e) => handleScrollReminder(e)} initialPage={0}>                                  
                    <View key={1} style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0}}>
                        <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
                            <Text style={{borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>1</Text> 
                            <Text style={{width:"80%",fontSize:15,fontWeight:"800",opacity:"0.7",marginBottom:0,marginLeft:20}}>Type in your concerns and describe how you feel in detail ...</Text>    
                        </View>         
                        <Image 
                            source={tutorial1}
                            style={{width:width,height:"60%"}}
                        />             
                    </View>

                    <View key={2} style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0}}>
                    <Text style={{position:"absolute",right:20,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>2</Text>
                    </View>

                    <View key={3} style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0}}>
                    <Text style={{position:"absolute",right:20,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>3</Text>
                    </View>

                    <View key={4}  style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0}}>
                    <Text style={{position:"absolute",right:20,top:0,borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>4</Text>
                    </View>                                
                </PagerView>  
            </View>    
            <View style={[styles.IndicatorContainer]}>               
                <View style={[styles.Indicator, { opacity: currentPage === 0 ? 1 : 0.3 }]} />                     
                <View style={[styles.Indicator, { opacity: currentPage === 1 ? 1 : 0.3 }]} />
                <View style={[styles.Indicator, { opacity: currentPage === 2 ? 1 : 0.3 }]} />
                <View style={[styles.Indicator, { opacity: currentPage === 3 ? 1 : 0.3 }]} />                                
            </View>                                                             
            </View>                        
            <View style={{borderWidth:1,width:"95%",borderRadius:20,alignItems:"center",backgroundColor:"black",marginTop:-50,padding:0,paddingBottom:25}}>                            
                <View style={{width:50, borderWidth:1.5,borderColor:"white", opacity:0.7,marginTop:10}} />
                <Text style={{color:"white",fontWeight:"700",fontSize:15,marginTop:10}}>Get Started</Text>
                {actions.map((data,index) => (
                    <TouchableOpacity key={index} onPress={() => handleAction(data.action)} style={!index % 2 == 0 ? styles.addInputContainerMental : styles.addInputContainer }>
                        <MaterialCommunityIcons 
                            name={data.icon_name}
                            color={!index % 2 == 0 ? "black" : "white"}
                            size={20}
                            style={{opacity:0.5}}
                        />
                        <Text style={[{color:"black",fontWeight:"400",marginLeft:20,fontWeight:"600"},index % 2 == 0 && {color:"white"}] }>{data.title}</Text>
                    </TouchableOpacity >  
                ))

                }                          
            </View> 
        </View> 
    
    )
}

function Explain_NavBar({
    setSelected
}){
    return(
        <View style={{padding:10,width:"100%",position:"absolute",top:50,justifyContent:"space-between",flexDirection:"row",alignItems:"center"}}>
            <MaterialCommunityIcons 
                name="arrow-left"
                size={30}
                onPress={() => setSelected([])}
            />
            <Text style={{fontWeight:"800",fontSize:20,opacity:1}}>How it works</Text>
            <MaterialCommunityIcons 
                name="arrow-left"
                size={30}
                opacity={"0"}
            />
        </View>
    )
}





