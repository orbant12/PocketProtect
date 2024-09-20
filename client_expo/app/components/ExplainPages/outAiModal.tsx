import { View,StyleSheet, Text, TouchableOpacity, Image } from "react-native"
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

    const aiImage_1 = Image.resolveAssetSource(require("../../assets/ourAi/1.png")).uri;
    const aiImage_2 = Image.resolveAssetSource(require("../../assets/ourAi/2.png")).uri;
    const aiImage_3 = Image.resolveAssetSource(require("../../assets/ourAi/3.png")).uri;
    const aiImage_4 = Image.resolveAssetSource(require("../../assets/ourAi/4.png")).uri;
    const aiImage_5 = Image.resolveAssetSource(require("../../assets/ourAi/5.png")).uri;
    const aiImage_6 = Image.resolveAssetSource(require("../../assets/ourAi/6.png")).uri;
    const aiImage_7 = Image.resolveAssetSource(require("../../assets/ourAi/7.png")).uri;
    const aiImage_8 = Image.resolveAssetSource(require("../../assets/ourAi/8.png")).uri;
    const aiImage_9 = Image.resolveAssetSource(require("../../assets/ourAi/9.png")).uri;
    const aiImage_10 = Image.resolveAssetSource(require("../../assets/ourAi/10.png")).uri;

    const aiImage_11 = Image.resolveAssetSource(require("../../assets/ourAi/11.png")).uri;
    const aiImage_12 = Image.resolveAssetSource(require("../../assets/ourAi/12.png")).uri;
    const aiImage_13 = Image.resolveAssetSource(require("../../assets/ourAi/13.png")).uri;



    return(
        <View style={styles.container}>
            <ProgressRow handleBack={(e) => handleBack(e)} progress={progress / 0.3}   />
                <View style={{width:"100%",height:"80%",flexDirection:"column",justifyContent:"space-between"}}>
                    {round(progress,1) == 0.1 &&<ExplainPageComponent_Type1 
                        data={[
                            {
                                imageUri:aiImage_1,
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
                            {icon_name:"information",title:"Training the Model",images:[
                                {image:aiImage_2},
                                {image:aiImage_3},
                                {image:aiImage_4},
                            ],
                        },
                            {icon_name:"information",title:"Understanding Features",images:[
                                {image:aiImage_5},
                                {image:aiImage_6},
                                {image:aiImage_7},
                            ]},
                            {icon_name:"information",title:"Making Predictions",images:[
                                {image:aiImage_8},
                            ]},
                            {icon_name:"information",title:"Confidence Level",images:[
                                {image:aiImage_9},
                            ]},
                            {icon_name:"information",title:"Decision Making",images:[
                                {image:aiImage_10},
                            ]},
                        ]}  
                        title="How AI Detects Cancer"
                        desc="In this module you can gain insight about how AI detects skin cancer !"
                    />
                    }
                    {round(progress,1) == 0.3 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"Accuracy",images:[
                                {image:aiImage_11,}
                            ],
                        },
                            {icon_name:"information",title:"Dataset",images:[
                                {image:aiImage_12}]},
                            {icon_name:"information",title:"Cloud",images:[
                                {image:aiImage_13}]},
                        ]}
                        title="Our Accuracy"
                        desc="Transparency is our main goal. We do not gain a penny with this application therefore we have no business influence. We just want the best for you !"
                    />
                    }
                </View>
                {round(progress,1) != 0.3 ?
                        <TouchableOpacity onPress={() => setProgress(progress + 0.1)} style={{width:"90%",padding:15,flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"magenta",borderRadius:10}}>
                            <Text style={{fontWeight:"700",fontSize:14,color:"white"}} >Next</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => handleClose()} style={{width:"90%",padding:15,flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"magenta",borderRadius:10}}>
                            <Text style={{fontWeight:"700",fontSize:14,color:"white"}} >Finish</Text>
                        </TouchableOpacity>
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