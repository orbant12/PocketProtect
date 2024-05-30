import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View,Text,TouchableOpacity,ScrollView } from "react-native"

export const SelectableBars = ({
    optionValue,
    setOptionValue,
    items = [{title:String,type:String,icon:{type: "image" | "icon",metaData:{name:String, size:Number, color:String} | {name:String, size:Numeber, style:{}}}}],
    style
}) => {
    return(
        <ScrollView style={[{width:"100%",marginTop:10,},style]}>  
            {items.map((data)=>(
                <SelectableBar 
                    optionValue={optionValue}
                    setOptionValue={setOptionValue}
                    type={data.type}
                    title={data.title}
                    icon={{type:data.icon.type,metaData:data.icon.metaData}}     
                />
            ))}                          
        </ScrollView>    
    )
}

const SelectableBar = ({
    setOptionValue,
    optionValue,
    type,
    title,
    icon
}) => {
    return(
        <TouchableOpacity onPress={() => setOptionValue(type)} style={[{width:"95%",padding:0,flexDirection:"row",alignItems:"center",borderWidth:2,borderRadius:10,alignSelf:"center",marginTop:20}, optionValue == type && {borderColor:"magenta"}]}>
            {icon.type == "icon" &&
                <View style={[{borderWidth:0,padding:15,borderRightWidth:2,borderRadius:10,borderTopRightRadius:0,borderBottomRightRadius:0},optionValue == type && {borderColor:"magenta"}]}>
                    <MaterialCommunityIcons 
                        name={icon.metaData.name}
                        size={icon.metaData.size}
                        color={optionValue == type ? "magenta" : "black"}
                    />   
                </View>    
            }
            {icon.type == "image" &&   
                <Image 
                    source={icon.metaData.name}
                    style={[{position:"relative",width:icon.metaData.size != undefined ? icon.metaData.size : 30,height:icon.metaData.size != undefined ? icon.metaData.size : 30},icon.metaData.style]}
                />
            }                      
            <Text style={{marginLeft:20,fontWeight:"700",fontSize:17,opacity:0.7}}>{title}</Text>     
        </TouchableOpacity>
    )
}