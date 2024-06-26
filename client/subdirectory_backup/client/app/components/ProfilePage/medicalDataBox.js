import { View, Switch, Text, Pressable} from 'react-native';
import { styles } from '../../styles/chatBot_style';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const MedicalData_Box = ({index,data,handleSwitch}) => {
    return(
        <View key={index} style={[styles.contextBox, !data.stateName ? {backgroundColor:"magenta"} : {backgroundColor:"lightgreen"}]}>
        <View style={[styles.cardRight, !data.stateName && {}]}>
          <View>
            {!data.stateName ? 
              <Text style={{color:"magenta",fontWeight:"500",fontSize:10}}>Not Active</Text>
            :
              <Text style={{color:"lightgreen",fontWeight:"500",fontSize:10}}>Active  </Text>
            }
      
            <Text style={{color:"white",fontWeight:"700",fontSize:20}}>
              {data.title}
          </Text>
          </View>

          <Pressable style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:20,padding:8,justifyContent:"center",backgroundColor:"white"}, !data.stateName ? {borderColor:"magenta"} : {borderColor:"lightgreen"}]}>
              <Text style={{color:"black",marginRight:10,fontWeight:"600"}}>See Data</Text>
              <MaterialCommunityIcons 
                name='arrow-right'
                color={!data.stateName? "magenta" : "lightgreen"}
                size={15}
              />
          </Pressable>
        </View>
        <View style={[styles.cardLeft,  !data.stateName && {}]}>
          <Switch value={data.stateName} onValueChange={(e) => handleSwitch(data.stateID,e)} thumbColor={"white"} trackColor={"magenta"} ios_backgroundColor={"magenta"} />
        </View>
        </View>
    )
}