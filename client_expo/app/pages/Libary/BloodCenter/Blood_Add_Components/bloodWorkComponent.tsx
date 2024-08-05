import { ScrollView, Text, TextInput, View } from "react-native";

export function BloodWorkComponent({
    setFocused,
    handleBloodWorkDataChange,
    index,
    bloodWorkData
}){
    return(
        <ScrollView style={{width:"100%",paddingTop:10,}}>
            <View style={{width:"100%",alignItems:"center",marginBottom:30}}>
                {bloodWorkData[index].data.map((dataFrom,index) =>(
                    <View key={index} style={{flexDirection:"row",width:"90%",justifyContent:"space-between",alignItems:"center",marginTop:20,borderWidth:2,padding:20,borderRadius:20}}>
                        <Text style={{fontWeight:"600",width:"70%"}}>{dataFrom.type}</Text>
                        <View style={{borderLeftWidth:2}}>        
                            <TextInput 
                                keyboardType="numeric"
                                style={{width:70,borderWidth:1,padding:9,color:"black",borderRadius:10,marginLeft:20}}                   
                                value={`${dataFrom.number}`}
                                onChangeText={(e) => handleBloodWorkDataChange(bloodWorkData[index].title,dataFrom.type,e)}
                                textAlign="center"      
                                onFocus={() => setFocused(true)}      
                            />                   
                        </View> 
                    </View>
                ))
                    
                }       
            </View>
        </ScrollView>
    )
}