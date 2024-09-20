

import { View,StyleSheet, Text, TouchableOpacity } from "react-native"
import { useState } from "react";
import { ExplainPageComponent_Type1, ExplainPageComponent_Type2, ProgressRow } from "./explainPage";
import { SkinBurnScreen } from "../../pages/Libary/Melanoma/ProcessScreens/Fullprocess/burnInput";


export const SunBurn_Modal_View = ({handleClose}) => {

    const [progress, setProgress] = useState(0.1);
    const [haveBeenBurned, setHaveBeenBurned] = useState<boolean>(false)
    const [change, setChange] = useState(false)

    function round(value: number, decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }

    const handleBack = (permission:boolean) => {
        if (round(progress,1) == 0.1 || permission == true){
            handleClose()
        } else if (haveBeenBurned != true) {
            setProgress(round(progress,1) - 0.1)
        } else {
            setHaveBeenBurned(false)
            setChange(!change)
        }
    }

    return(
        <View style={styles.container}>
            <ProgressRow handleBack={(e) => handleBack(e)} progress={progress / 0.6}   />
                <View style={{width:"100%",height:"80%",flexDirection:"column",justifyContent:"space-between"}}>
                    {round(progress,1) == 0.1 &&<ExplainPageComponent_Type1 
                        data={[
                            {
                                imageUri:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg",
                                textComponent: () => (
                                    <>
                                        <Text style={{color:"white",fontSize:12,fontWeight:"600",opacity:0.8,marginBottom:0}}>In this module you can <Text style={{color:"magenta",fontWeight:"700"}}>track</Text> your <Text style={{color:"magenta",fontWeight:"700"}}>sun exposure</Text> history which can be very useful to know longterm to know your level of <Text style={{color:"magenta",fontWeight:"700"}}>potential risk</Text></Text>
                                    </>
                                )
                            },
                        ]}
                        style={{marginTop:40}}
                        title="Track Sun Exposure"
                        
                        desc="Extreme sun exposure increases the risk of skin cancer by damaging the DNA in skin cells due to ultraviolet (UV) radiation. Over time, this damage can lead to mutations into cancerous tumors"
                    />
                    }
                    {round(progress,1) == 0.2 && <SkinBurnScreen 
                        setProgress={() => setProgress(0.3)}
                        progress={progress}
                        setHaveBeenBurned={setHaveBeenBurned}
                        haveBeenBurned={haveBeenBurned}
                        selectionStyle={{height:"110%"}}
                        addStyle={{height:"110%"}}
                        change={change}
                    />
                    }
                    {round(progress,1) == 0.3 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"Achivements",images:[
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                            ],
                        },
                            {icon_name:"information",title:"Achivements",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                            {icon_name:"information",title:"Accuracy",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                        ]}
                        title="How prone your skin is to cancer"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                    {round(progress,1) == 0.4 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"Asymetry",images:[
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                            ],
                        },
                            {icon_name:"information",title:"Asymetry",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                            {icon_name:"information",title:"Asymetry",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                        ]}
                        
                        title="How to avoid by protection"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                    {round(progress,1) == 0.5 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"Asymetry",images:[
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                            ],
                        },
                            {icon_name:"information",title:"Asymetry",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                            {icon_name:"information",title:"Asymetry",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                        ]}
                        title="Power of Open Source"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                    {round(progress,1) == 0.6 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"Asymetry",images:[
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                            ],
                        },
                            {icon_name:"information",title:"Asymetry",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                            {icon_name:"information",title:"Asymetry",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                        ]}
                        title="Finish"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                </View>
                {!(round(progress,1) == 0.2) ?
                    <TouchableOpacity onPress={() => setProgress(progress + 0.1)} style={{width:"90%",padding:15,flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"magenta",borderRadius:10}}>
                        <Text style={{fontWeight:"700",fontSize:14,color:"white"}} >Next</Text>
                    </TouchableOpacity>
                    :
                    null
                }

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        height:"100%",
        alignItems:"center",
    }

})


const Page_1 = () => {
    return(
       <></> 
    )
};