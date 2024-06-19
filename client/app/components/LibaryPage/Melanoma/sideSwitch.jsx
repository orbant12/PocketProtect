import { View, Text, Pressable } from "react-native"
import { spotUploadStyle } from "../../../styles/libary_style"

export const SideSwitch = ({
    selectedSide,
    setSelectedSide,
}) => {
    return(
        <View style={spotUploadStyle.positionSwitch}>
        <Pressable onPress={() => setSelectedSide("front")}>
            <Text style={selectedSide == "front" ? {fontWeight:"600"}:{opacity:0.5}}>Front</Text>
        </Pressable>
        <Text>|</Text>
        <Pressable onPress={() => setSelectedSide("back")}>
            <Text style={selectedSide == "back" ? {fontWeight:"600"}:{opacity:0.5}}>Back</Text>
        </Pressable>
        </View>  
    )
}