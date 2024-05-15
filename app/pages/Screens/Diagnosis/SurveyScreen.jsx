import { View,Text,TouchableOpacity } from "react-native"
import React,{useState} from "react"

const SurveyScreeen = ({route}) => {

    const surveyData = route.params.data
    const [progress , setProgress] =useState(0)

    return(
        <View>
                <Text>{surveyData[progress].q}</Text>
                <TouchableOpacity  onPress={() => setProgress(progress + 1)}>
                    <Text>Next</Text>
                </TouchableOpacity>
        </View>
    )
}

export default SurveyScreeen