
import { View,StyleSheet, Text, TouchableOpacity, Image } from "react-native"
import { useEffect, useState } from "react";
import { ExplainPageComponent_Type1, ExplainPageComponent_Type2, ProgressRow } from "./explainPage";
import { SkinTypeScreen } from "../../pages/Libary/Melanoma/ProcessScreens/Fullprocess/skinSelect";
import { SkinType } from "../../utils/types";
import { useAuth } from "../../context/UserAuthContext";


export const SkinData_Modal_View = ({handleClose}) => {

    const [progress, setProgress] = useState(0.1);
    const { currentuser, melanoma } = useAuth()

    const skinImage = Image.resolveAssetSource(require("../../assets/type.png")).uri;
    const skin2Image = Image.resolveAssetSource(require("../../assets/sInfo1.png")).uri;
    const skin3Image = Image.resolveAssetSource(require("../../assets/sInfo2.png")).uri;
    const skin4Image = Image.resolveAssetSource(require("../../assets/sInfo3.png")).uri;
    const skin5Image = Image.resolveAssetSource(require("../../assets/sInfo4.png")).uri;
    const skin6Image = Image.resolveAssetSource(require("../../assets/sInfo5.png")).uri;
    const skin7Image = Image.resolveAssetSource(require("../../assets/sInfo6.png")).uri;

    const [ skinData, setSkinData ] = useState<SkinType | null>(null)

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

    const handleSaveSkin = async () => {

        await melanoma.updateSkinType(skinData)
    }

    const handleLoad = async ()  => {
        await melanoma.fetchSkinType()

        setSkinData(melanoma.getSkinType())
    }

    useEffect(() => {
        handleLoad()
    },[])

    return(
        <View style={styles.container}>
            <ProgressRow handleBack={(e) => handleBack(e)} progress={progress / 0.4}   />
                <View style={[{width:"100%",height:"80%",flexDirection:"column",justifyContent:"space-between"},round(progress,1) == 0.2 && {height:"100%"}]}>
                    {round(progress,1) == 0.1 &&<ExplainPageComponent_Type1 
                        data={[
                            {
                                imageUri:skinImage,
                                textComponent: () => (
                                    <>
                                        <Text style={{color:"white",fontSize:12,fontWeight:"600",opacity:0.8,marginBottom:0}}>In this module you can add your skin type so our we can give you <Text style={{color:"magenta",fontWeight:"700"}}>personalised information</Text> for staying safe from skin cancer</Text>
                                    </>
                                )
                            },
                        ]}
                        style={{marginTop:40}}
                        title="Your skin and skin cancer"
                        
                        desc="Avoid skin cancer with our AI Model which has 85% accuracy & beats the average dermatologist's 70% accuracy "
                    />
                    }
                    {round(progress,1) == 0.2 && <SkinTypeScreen 
                        setProgress={(e) =>{ setProgress(e);handleSaveSkin()}}
                        progress={progress}
                        handleMelanomaDataChange={(e:string,n:SkinType) => setSkinData(n)}
                        melanomaMetaData={{skin_type:skinData}}
                    />
                    }
                    {round(progress,1) == 0.3 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"Fair Skin and Increased UV Sensitivity",images:[
                                {image:skin2Image},
                            ],
                        },
                            {icon_name:"information",title:"Darker Skin and Lower Skin Cancer Awareness",images:[{image:skin3Image}]},
                            {icon_name:"information",title:"Genetic Factors in Different Skin Types",images:[{image:skin4Image}]},
                        ]}
                        title="How prone your skin is to cancer"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                    {round(progress,1) == 0.4 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"Fair Skin",images:[
                                {image:skin5Image},
                            ],
                        },
                            {icon_name:"information",title:"Darker Skin",images:[{image:skin6Image}]},
                            {icon_name:"information",title:"Genetically Predisposed Individuals",images:[{image:skin7Image}]},
                        ]}
                        
                        title="How to avoid by protection"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                </View>
                {round(progress,1) != 0.2 && 
                    (round(progress,1) != 0.4 ?
                        <TouchableOpacity onPress={() => setProgress(progress + 0.1)} style={{width:"90%",padding:15,flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"magenta",borderRadius:10}}>
                            <Text style={{fontWeight:"700",fontSize:14,color:"white"}} >Next</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => handleClose()} style={{width:"90%",padding:15,flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"magenta",borderRadius:10}}>
                            <Text style={{fontWeight:"700",fontSize:14,color:"white"}} >Finish</Text>
                        </TouchableOpacity>
                    )
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