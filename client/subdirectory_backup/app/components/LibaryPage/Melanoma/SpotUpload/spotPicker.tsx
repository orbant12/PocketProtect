import { View, Text, Pressable,GestureResponderEvent} from "react-native";
import { dotSelectOnPart } from '../../../../pages/Libary/Melanoma/ProcessScreens/melanomaDotSelect'
import { Gender, SkinType, SpotArrayData } from "../../../../utils/types";
import { ClientMemory_Spots } from "../../../../pages/Libary/Melanoma/ProcessScreens/melanomaSingleSlug";

export function SpotPicker({
    redDotLocation,
    setRedDotLocation,
    bodyPart,
    currentSlugMemory,
    gender,
    highlighted,
    skinColor
}:{
    redDotLocation:{x:number,y:number};
    setRedDotLocation:(arg:{x:number,y:number}) => void;
    bodyPart: SpotArrayData;
    currentSlugMemory:ClientMemory_Spots[];
    gender:Gender;
    highlighted:string;
    skinColor:SkinType;
}){
    const handlePartClick = (e:GestureResponderEvent) => {
        const { locationX, locationY } = e.nativeEvent;
        setRedDotLocation({ x: locationX, y: locationY })    
    }

    return(
        
        <>
            <View style={{flexDirection:"column",width:"95%",marginTop:-20}}>
                <Text><Text style={redDotLocation.x == -100 ? {opacity:0.3}:{color:"green",fontWeight:"600"}}>1/2</Text> Tap on the screen</Text>
                <Text style={{fontSize:20,fontWeight:"600"}}>Where is your spot ?</Text>
            </View>

            <Pressable style={{position:"relative",alignItems:"center",justifyContent:"center",width:500,height:500,marginTop:20}} onPress={(e) => handlePartClick(e)}>
                    {dotSelectOnPart({
                        bodyPart,
                        redDotLocation,
                        currentSlugMemory,
                        gender: gender,
                        highlighted,
                        skinColor
                    })}
            </Pressable>
        </>
    )
    
}