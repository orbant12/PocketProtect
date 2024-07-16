
import { Text,View,TouchableOpacity,Image,Modal,Dimensions} from 'react-native';
import { HeaderContainer } from "../Common/headerContainer";
import { NavBar_OneOption } from "../Common/navBars";
import { PagerComponent } from "../Common/pagerComponent";
import tutorial1 from "../../assets/diagnosis/first.png"
import { Navigation_MoleUpload_1,Navigation_MelanomaFullsetup } from "../../navigation/navigation";
import { styles } from "../../styles/add_style";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const { width } = Dimensions.get('window');

export const ExplainModal = ({
    selected,
    setSelected,
}) => {

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
    
    return(
        <Modal visible={selected.length != 0}>
        <Explain_NavBar 
            setSelected={setSelected}
        />
        <ExplainPanel 
            handleAction={handleAction}
            actions={selected}
        />
    </Modal>   
    )
}


function ExplainPanel({actions,handleAction}){
    return(
        <View style={{width:"100%",alignItems:"center",height:"80%",justifyContent:"space-between",marginTop:0}}>   
            <View style={{width:"100%",borderTopWidth:0}}>  
            <PagerComponent 
                pages={[
                    {pageComponent:() => 
                        <TutorialPage
                            image={tutorial1}
                            title={"Type in your concerns and describe how you feel in detail ..."}
                            index={1}
                        />
                    },
                    {pageComponent:() => 
                        <TutorialPage
                            image={tutorial1}
                            title={"Type in your concerns and describe how you feel in detail ..."}
                            index={2}
                        />
                    },
                ]}
                pagerStyle={{height:"70%",borderWidth:1,marginTop:10}}
                indicator_position={{backgroundColor:"black",padding:12}}
                dotColor={"white"}
            />                                                       
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
        HeaderContainer({
            outerBg:"white",
            content:() =>
                <NavBar_OneOption 
                    icon_left={{name:"arrow-left",size:25,action:() => setSelected([])}}
                    title={"How it works ?"}
                    styles={{alignSelf:"center",marginTop:5}}
                />
        }) 
    )
}

const TutorialPage = ({
    index,
    image,
    title
}) => {
    return(
        <View key={index} style={{width:"100%",justifyContent:"center",alignItems:"center",borderWidth:0,height:"100%",padding:10}}>
        <View style={{flexDirection:"row",alignItems:"center",marginBottom:10,marginTop:0}}>
            <Text style={{borderRadius:15,paddingVertical:5,paddingHorizontal:10,borderWidth:1}}>{index}</Text> 
            <Text style={{width:"80%",fontSize:15,fontWeight:"800",opacity:"0.7",marginBottom:0,marginLeft:20}}>{title}</Text>    
        </View>         
        <Image 
            source={image}
            style={{width:width,height:"65%",borderWidth:0,marginBottom:0}}
        />             
    </View>
    )
}