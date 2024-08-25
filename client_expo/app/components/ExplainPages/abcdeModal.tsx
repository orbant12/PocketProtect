import { View,StyleSheet, Text, TouchableOpacity, Image } from "react-native"
import { useState } from "react";
import { ExplainPageComponent_Type1, ExplainPageComponent_Type2, ProgressRow } from "./explainPage";


export const ABCDE_Modal_View = ({handleClose}) => {

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

    const Image_1 = Image.resolveAssetSource(require("../../assets/abcde/a/1.png")).uri;
    const Image_2 = Image.resolveAssetSource(require("../../assets/abcde/a/Asymetry.png")).uri;
    const Image_3 = Image.resolveAssetSource(require("../../assets/abcde/a/3.png")).uri;
    const Image_4 = Image.resolveAssetSource(require("../../assets/abcde/a/4.png")).uri;
    const Image_5 = Image.resolveAssetSource(require("../../assets/abcde/a/5.png")).uri;
    const Image_6 = Image.resolveAssetSource(require("../../assets/abcde/a/6.png")).uri;
    const Image_7 = Image.resolveAssetSource(require("../../assets/abcde/a/7.png")).uri;

    const Image_8 = Image.resolveAssetSource(require("../../assets/abcde/b/Border.png")).uri;
    const Image_9 = Image.resolveAssetSource(require("../../assets/abcde/b/9.png")).uri;
    const Image_10 = Image.resolveAssetSource(require("../../assets/abcde/b/10.png")).uri;
    const Image_11 = Image.resolveAssetSource(require("../../assets/abcde/b/11.png")).uri;
    const Image_12 = Image.resolveAssetSource(require("../../assets/abcde/b/12.png")).uri;
    const Image_13 = Image.resolveAssetSource(require("../../assets/abcde/b/13.png")).uri;

    const Image_14 = Image.resolveAssetSource(require("../../assets/abcde/c/Color.png")).uri;
    const Image_15 = Image.resolveAssetSource(require("../../assets/abcde/c/Color (2).png")).uri;
    const Image_16 = Image.resolveAssetSource(require("../../assets/abcde/c/Color (3).png")).uri;
    const Image_17 = Image.resolveAssetSource(require("../../assets/abcde/c/Color (4).png")).uri;
    const Image_18 = Image.resolveAssetSource(require("../../assets/abcde/c/18.png")).uri;
    const Image_19 = Image.resolveAssetSource(require("../../assets/abcde/c/Color (5).png")).uri;
    const Image_20 = Image.resolveAssetSource(require("../../assets/abcde/c/Color (6).png")).uri;
    

    const Image_21 = Image.resolveAssetSource(require("../../assets/abcde/d/Diameter.png")).uri;
    const Image_22 = Image.resolveAssetSource(require("../../assets/abcde/d/22.png")).uri;
    const Image_23 = Image.resolveAssetSource(require("../../assets/abcde/d/23.png")).uri;
    const Image_24 = Image.resolveAssetSource(require("../../assets/abcde/d/24.png")).uri;
    const Image_25 = Image.resolveAssetSource(require("../../assets/abcde/d/25.png")).uri;
    const Image_26 = Image.resolveAssetSource(require("../../assets/abcde/d/26.png")).uri;
    
    const Image_27 = Image.resolveAssetSource(require("../../assets/abcde/e/Evolve.png")).uri;
    const Image_28 = Image.resolveAssetSource(require("../../assets/abcde/e/Evolve (2).png")).uri;
    const Image_29 = Image.resolveAssetSource(require("../../assets/abcde/e/Evolve (3).png")).uri;
    const Image_30 = Image.resolveAssetSource(require("../../assets/abcde/e/Evolve (4).png")).uri;
    const Image_31 = Image.resolveAssetSource(require("../../assets/abcde/e/Evolve (5).png")).uri;
    const Image_32 = Image.resolveAssetSource(require("../../assets/abcde/e/32.png")).uri;
    const Image_33 = Image.resolveAssetSource(require("../../assets/abcde/e/Evolve (6).png")).uri;
    const Image_34 = Image.resolveAssetSource(require("../../assets/abcde/e/Evolve (7).png")).uri;







    return(
        <View style={styles.container}>
            <ProgressRow handleBack={(e) => handleBack(e)} progress={progress / 0.6}   />
                <View style={{width:"100%",height:"80%",flexDirection:"column",justifyContent:"space-between"}}>
                    {round(progress,1) == 0.1 &&<ExplainPageComponent_Type1 
                        data={[
                            {
                                imageUri:Image_1,
                                textComponent: () => (
                                    <>
                                        <Text style={{color:"white",fontSize:14,fontWeight:"600",opacity:0.8,marginBottom:7}}>ABCDE stands for <Text style={{color:"magenta",fontWeight:"700"}}>Asymmetry</Text> , <Text style={{color:"magenta",fontWeight:"700"}}>Border</Text>,  <Text style={{color:"magenta",fontWeight:"700"}}>Color</Text>,  <Text style={{color:"magenta",fontWeight:"700"}}>Diameterr</Text> and  <Text style={{color:"magenta",fontWeight:"700"}}>Evolving</Text> </Text>
                                    </>
                                )
                            },
                        ]}
                        style={{marginTop:40}}
                        title="ABCDE rule"
                        
                        desc="Guide to the usual signs of melanoma. Looks for changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                    {round(progress,1) == 0.2 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"What to Look For",images:[
                                {image:Image_2},
                                {image:Image_3},
                                {image:Image_4},
                            ],
                        },
                            {icon_name:"information",title:"How It Looks",images:[{image:Image_5}]},
                            {icon_name:"information",title:"How It Works",images:[{image:Image_6},{image:Image_7}]},
                        ]}
                        title="Asymetry"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                    {round(progress,1) == 0.3 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"What to Look For",images:[
                                {image:Image_8},
                                {image:Image_9},
                                {image:Image_10},
                            ],
                        },
                            {icon_name:"information",title:"How It Looks",images:[{image:Image_11}]},
                            {icon_name:"information",title:"How It Works",images:[{image:Image_12},{image:Image_13}]},
                        ]}
                        title="Border"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                    {round(progress,1) == 0.4 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"What to Look For",images:[
                                {image:Image_14},
                                {image:Image_15},
                                {image:Image_16},
                                {image:Image_17},
                            ],
                        },
                            {icon_name:"information",title:"How It Looks",images:[{image:Image_18}]},
                            {icon_name:"information",title:"How It Works",images:[{image:Image_19},{image:Image_20}]},
                        ]}
                        title="Color"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                    {round(progress,1) == 0.5 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"What to Look For",images:[
                                {image:Image_21},
                                {image:Image_22},
                                {image:Image_23},
                            ],
                        },
                            {icon_name:"information",title:"How It Looks",images:[{image:Image_24}]},
                            {icon_name:"information",title:"How It Works",images:[{image:Image_25},{image:Image_26}]},
                        ]}
                        title="Diameter"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                    {round(progress,1) == 0.6 && <ExplainPageComponent_Type2 
                        data={[
                            {icon_name:"information",title:"What to Look For",images:[
                                {image:Image_27},
                                {image:Image_28},
                                {image:Image_29},
                                {image:Image_30},
                                {image:Image_31},
                            ],
                        },
                            {icon_name:"information",title:"How It Looks",images:[{image:Image_32}]},
                            {icon_name:"information",title:"How It Works",images:[{image:Image_33},{image:Image_34}]},
                        ]}
                        title="Evolving"
                        desc="The ABCDE rule is a guide to the usual signs of melanoma. Be aware of any changes in the size, shape, color, or feel of an existing mole or the appearance of a new spot."
                    />
                    }
                </View>
                {round(progress,1) != 0.6 ?
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