import { ExpStyle } from "../app/styles/add_style"
import { View, Text } from "react-native"

const BloodBox = ({
    setSelected
}:{
    setSelected:React.Dispatch<React.SetStateAction<string>>
}) => {
    return(
        <>
        <Text style={{fontWeight:"800",fontSize:24,margin:15,alignSelf:"flex-start"}}>Blood Analasis</Text>
        <View style={ExpStyle.section}>
            {/* <FeatureBox 
                icon={{name:"water-plus",size:30}}
                backgroundImage={bloodBG}
                title={"Blood Work"}
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
                setSelected={setSelected}
            /> */}
        </View>
        </>
    )
}