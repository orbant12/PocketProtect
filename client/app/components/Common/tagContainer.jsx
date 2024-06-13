import { View, Text,} from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const TagContainer = ({
    labels,
    style
}) => {
    return(
            <View style={[{width:"95%",flexDirection:"row",flexWrap:"wrap",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.2)",padding:5,borderRadius:5},style]}>
            {labels.map((data) => (
                <TagLabel label={data.text} icon={data.icon_name} />
            ))}                    
        </View>
    )
}

export const TagLabel = ({
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