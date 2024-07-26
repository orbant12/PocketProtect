import { View, Switch, Text, Pressable} from 'react-native';
import { styles } from '../../styles/chatBot_style';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const MedicalData_Box = ({index,data,handleSwitch,avalible}) => {
    return( 
      <>
        {avalible ?
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
          <Pressable style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:5,padding:8,justifyContent:"center",backgroundColor:"white"}, !data.stateName ? {borderColor:"magenta"} : {borderColor:"lightgreen"}]}>
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
        :
        <View key={index} style={[styles.contextBox, {backgroundColor:"rgba(255,0,0,0.7)"} ]}>
        <View style={[styles.cardRight, !data.stateName && {}]}>
          <View>
 
            <Text style={{color:"white",fontWeight:"500",fontSize:10}}>Need to provide data to access !</Text>
            
      
            <Text style={{color:"rgba(255,0,0,0.8)",fontWeight:"700",fontSize:20}}>
              {data.title}
          </Text>
          </View>
          <Pressable style={[{flexDirection:"row",alignItems:"center",borderWidth:0,borderColor:"magenta",borderRadius:5,padding:8,justifyContent:"center",backgroundColor:"white"}, !data.stateName ? {borderColor:"magenta"} : {borderColor:"lightgreen"}]}>
              <Text style={{color:"black",marginRight:10,fontWeight:"600"}}>Add Data To Access</Text>
              <MaterialCommunityIcons 
                name='arrow-right'
                color={"rgba(255,0,0,1)"}
                size={15}
              />
          </Pressable>
        </View>
        <View style={[styles.cardLeft,  !data.stateName && {}]}>
          <MaterialCommunityIcons 
            name='lock'
            color={"white"}
            style={{opacity:0.8}}
            size={24}
          />
        </View>
        </View>
            } 
        </>
    )
}