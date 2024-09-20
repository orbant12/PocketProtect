import React, { useState } from "react"
import { View, Text, Image,TouchableOpacity, Modal} from "react-native"
const medic = require('../../../../assets/abcde.png');
import { Navigation_AssistCenter } from "../../../../navigation/navigation"
import { styles_shadow } from "../../../../styles/shadow_styles"
import { ABCDE_Modal_View } from "../../../ExplainPages/abcdeModal";
import { Ai_Modal_View } from "../../../ExplainPages/outAiModal";
import { SkinData_Modal_View } from "../../../ExplainPages/skinDataModal";
import { SunBurn_Modal_View } from "../../../ExplainPages/sunBurnModal";


export const OneOptionBox = (
    {
        navigation,
        buttonTitle,
        mainTitle,
        subTitle,
        image,
        bgColor,
        stw,
        textColor,
        onClick="",
        imageStyle,
        tw,
        id
    }:{
        navigation:any;
        buttonTitle:string;
        mainTitle:string;
        subTitle:string;
        image:any;
        bgColor:string;
        stw?:number;
        textColor?:string;
        onClick?:any;
        imageStyle?:any;
        tw?:number;
        id:"skin_data" | "sun_burn" | "ai_model" | "abcde" | "alert";
    }) => {

    const [activeModal, setActiveModal] = useState<"skin_data" | "sun_burn" | "ai_model" | "abcde" | null>(null);

    return(
        <>
        <View style={[{width:"90%",marginTop:20,alignItems:"center",backgroundColor:bgColor,padding:0,borderRadius:10,flexDirection:"row",height:170,borderWidth:4,borderColor:"white"},styles_shadow.shadowContainer]}>
        <Text style={{fontWeight:"700",fontSize:10,color:textColor != undefined ? textColor : "black",opacity:0.4,position:"absolute",top:10,marginLeft:10,marginTop:5,width: stw != undefined ? stw : 130}}>{subTitle}</Text>
        <Text style={{fontWeight:"800",fontSize:20,color:textColor != undefined ? textColor : "black",opacity:0.8,marginTop:0,maxWidth:"100%",marginLeft:10,marginBottom:40,width: tw != undefined ? tw : 230}}>{mainTitle}</Text>
        <TouchableOpacity onPress={() => {id != "alert" ? setActiveModal(id) : alert(onClick) }} style={[{width:"50%",borderWidth:2,padding:8,borderColor:"white",borderRadius:100,alignItems:"center",opacity:1,marginTop:20,zIndex:100,backgroundColor:"black",position:"absolute",bottom:20,left:10},styles_shadow.hightShadowContainer]}>
            <Text style={{color:"white",fontWeight:"800",fontSize:12,opacity:1}}>{buttonTitle}</Text>
        </TouchableOpacity>
        <Image 
            source={image}
            style={[{width:170,height:160,position:"absolute",right:0,zIndex:-1},imageStyle]}
        />
        
    </View>

    <Modal visible={activeModal != null} presentationStyle="overFullScreen" animationType="slide">
        {activeModal == "abcde" &&
            <ABCDE_Modal_View 
                handleClose={() => setActiveModal(null)}
            />
        }
        {activeModal == "ai_model" &&
            <Ai_Modal_View 
                handleClose={() => setActiveModal(null)}
            />
        }
        {activeModal == "skin_data" && 
            <SkinData_Modal_View 
                handleClose={() => setActiveModal(null)}
            />
        }
        {activeModal == "sun_burn" &&
            <SunBurn_Modal_View 
                handleClose={() => setActiveModal(null)}
            />
        }
    </Modal>
    </>
    )
}