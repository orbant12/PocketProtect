import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View,Text,Pressable,StyleSheet } from "react-native"
import { OptionsBoxes } from './optionBoxes';
import { SelectableBars } from './selectableBars';



export const SelectionPage = ({
    pageStyle = {},
    selectableStyle = {},
    pageTitle,
    selectableOption,
    buttonAction = {type:"next" | "trigger", actionData:{progress:Number, increment_value:Number} | {triggerAction:() => Object}},
    selectableData = {title:String,type:String,icon:{type: "image" | "icon", metaData: {name:String, size:Number, color:String, style:{} }}},
    setOptionValue,
    optionValue,
    setProgress,
    progress,
    increment_value
}) => {
    return(
        <View style={[styles.startScreen,pageStyle]}>            
            <Text style={{marginBottom:10,fontWeight:"800",fontSize:20,marginTop:60}}>{pageTitle}</Text>  
            {selectableOption == "box" && 
                <OptionsBoxes                
                    items={selectableData}
                    setOptionValue={setOptionValue}
                    optionValue={optionValue}
                    style={selectableStyle}
                />
            }
            {selectableOption == "bar" && 
                <SelectableBars
                    items={selectableData}
                    setOptionValue={setOptionValue}
                    optionValue={optionValue}
                    style={selectableStyle}
                />
            }
            <View style={{width:"100%",alignItems:"center"}}>
                {optionValue != null ? 
                    <Pressable 
                        onPress={() => {
                            buttonAction.type == "next" && setProgress(buttonAction.actionData.progress + buttonAction.actionData.increment_value);
                            buttonAction.type == "trigger" && buttonAction.actionData.triggerAction();
                        }}
                        style={[styles.startButton,{position:"relative",marginBottom:20}]}
                    >
                        <Text style={{padding:15,fontWeight:"600",color:"white"}}>Next</Text>
                    </Pressable>
                    :
                    <Pressable style={styles.startButtonNA}>
                        <Text style={{padding:15,fontWeight:"600"}}>Not Selected Yet</Text>
                    </Pressable>
                }      
                </View>
        </View>

    )
}


const styles = StyleSheet.create({
    startButton:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:10,        
        backgroundColor:"black",
        position:"absolute",
        bottom:20
    },
    startButtonNA:{
        borderWidth:1,
        alignItems:"center",
        width:"90%",
        borderRadius:20,
        marginBottom:20,
        opacity:0.3
    },
    startScreen:{
        borderWidth:0,
        padding:5,
        width:"100%",
        alignItems:"center",
        height:"100%",
        justifyContent:"space-between",
        marginBottom:0,
        backgroundColor:"white",
        zIndex:-1
    },
})