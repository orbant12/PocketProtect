import { View, Text, ScrollView,Image,TouchableOpacity } from "react-native"
import { Navigation_MoleUpload } from "../../navigation/navigation"
import melanomaBG from "../../assets/features/melanoma.png"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ExpStyle } from "../../styles/add_style";

export const ExploreView = ({navigation}) => {

    const handleNavigation = (path) => {
        if ( path == "Melanoma Monitor"){
            Navigation_MoleUpload({
                navigation: navigation
            })
        }
    }
    
    return(
        <ScrollView style={{width:"100%",height:"100%"}}>
        <View style={ExpStyle.container}>
                <Text style={{margin:30,fontSize:20,fontWeight:"600",alignSelf:"left"}}>Explore</Text>
                <View style={ExpStyle.section}>
                    <FeatureBox 
                        icon={{name:"liquid-spot",size:30}}
                        backgroundImage={melanomaBG}
                        title={"Melanoma Monitor"}
                        labels={[
                            {
                                text:"Real Dermotologis",
                                icon_name:"doctor"
                            },
                            {
                                text:"Deep Neural Network",
                                icon_name:"brain"
                            },
                            {
                                text:"Personal Reminder",
                                icon_name:"calendar"
                            },
                            {
                                text:"Personalised Advice",
                                icon_name:"magnify"
                            },
                        ]}
                        handleNavigation={handleNavigation}
                    />
                </View>
        </View>
        </ScrollView>
        
    )
}

const FeatureBox = ({
    icon,
    backgroundImage,
    title,
    labels,
    handleNavigation
}) => {
    return(
        <View style={[ExpStyle.featureBox]}>
            <Image 
                source={backgroundImage}
                style={{position:"absolute",width:"100%",height:"100%",zIndex:0,opacity:0.4}}
            />
            <View style={{padding:10,width:"100%",height:"100%",justifyContent:"space-between",alignItems:"center"}}>
                <View style={{width:"100%",justifyContent:"center",flexDirection:"row",alignItems:"center",marginTop:10}}>
                    <MaterialCommunityIcons 
                        name={icon.name}
                        size={icon.size}
                        color={"white"}
                    />
                    <Text style={{fontWeight:"700",fontSize:"18",color:"white",marginLeft:10}}>{title}</Text>
                </View>
        
                <View style={{width:"95%",flexDirection:"row",flexWrap:"wrap",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.2)",padding:5,borderRadius:5}}>
                    {labels.map((data) => (
                        <TagLabel label={data.text} icon={data.icon_name} />
                    ))}                    
                </View>
                <TouchableOpacity onPress={() => handleNavigation(title)} style={{flexDirection:"row",alignItems:"center",backgroundColor:"white",width:"100%",justifyContent:"center",padding:12,borderRadius:5,opacity:0.7}}>
                    <Text style={{fontSize:14,fontWeight:"600",marginRight:10}}>Start</Text>
                    <MaterialCommunityIcons 
                        name='arrow-right'
                        size={15}
                        color={"magenta"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const TagLabel = ({
    label,
    icon
}) => {
    return(
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginVertical:5,marginHorizontal:10}}>
        <MaterialCommunityIcons 
            name={icon}
            size={10}
            color={"white"}
        />
        <Text style={{color:"white",fontSize:9,marginLeft:5,fontWeight:"600"}}>{label}</Text>
    </View>
    )
}


