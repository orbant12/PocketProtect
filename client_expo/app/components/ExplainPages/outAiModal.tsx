import { View,StyleSheet, Text, TouchableOpacity } from "react-native"
import { useState } from "react";
import { ExplainPageComponent_Type1, ExplainPageComponent_Type2, ProgressRow } from "./explainPage";


export const Ai_Modal_View = ({handleClose}) => {

    const [progress, setProgress] = useState(0.1);

    function round(value: number, decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }

    const handleBack = (permission:boolean) => {
        if (round(progress,1) == 0.1 || permission == true){
            handleClose()
        } else {
            setProgress(round(progress,1) - 0.1)
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
                                        <Text style={{color:"white",fontSize:12,fontWeight:"600",opacity:0.8,marginBottom:0}}>In this module you will learn how AI can <Text style={{color:"magenta",fontWeight:"700"}}>detect malignant</Text> moles and why you <Text style={{color:"magenta",fontWeight:"700"}}>should choose</Text> our own trained model</Text>
                                    </>
                                )
                            },
                        ]}
                        style={{marginTop:40}}
                        title="Our AI Model"
                        
                        desc="Avoid skin cancer with our AI Model which has 85% accuracy & beats the average dermatologist's 70% accuracy "
                    />
                    }
                    {round(progress,1) == 0.2 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"Asymetry",images:[
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                                {image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"},
                            ],
                        },
                            {icon_name:"information",title:"Detection",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                            {icon_name:"information",title:"Detection",images:[{image:"https://www.cancer.org/content/dam/cancer-org/images/cancer-types/skin/melanoma-what-is-melanoma-illustration.jpg"}]},
                        ]}
                        title="How AI Detects Cancer"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
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
                        title="Our Accuracy"
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
                        
                        title="Optimised Dataset"
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
                <TouchableOpacity onPress={() => setProgress(progress + 0.1)} style={{width:"90%",padding:15,flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"magenta",borderRadius:10}}>
                    <Text style={{fontWeight:"700",fontSize:14,color:"white"}} >Next</Text>
                </TouchableOpacity>
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