import { Mstyles } from "../../../styles/libary_style"
import { View,Text,TouchableOpacity } from "react-native"
import Svg, { Circle, Path } from 'react-native-body-highlighter/node_modules/react-native-svg';
import { styles_shadow } from "../../../styles/shadow_styles";
import { BodyPart, SkinType, Slug, SpotData, UserData } from "../../../utils/types";
import { BodyPartPath } from "../../../pages/Libary/Melanoma/components/selectedSlugDots";

export type numberOfMolesOnSlugs = {Slug: number}[];


const getSlugCount = (slug,numberOfMolesOnSlugs:numberOfMolesOnSlugs) => {
    const slugObject = numberOfMolesOnSlugs.find(item => Object.keys(item)[0] === slug);
    return slugObject ? slugObject[slug] : 0;
};

const dotSelectOnPart = (bodyPart:BodyPart,userData:UserData,melanomaData:SpotData[],skin_type:SkinType) => {
    return (
        <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 
            {bodyPart != null ? (
                bodyPart.pathArray.map((path, index) => (
                    <BodyPartPath
                        path={path}
                        index={index}
                        skin_type={skin_type}
                        bodyPart={bodyPart}
                        userData={userData}
                        stroke={"rgba(255,255,255,0.5)"}
                    />
                ))
            ):null}
            {melanomaData &&
            melanomaData.map((data:SpotData,index:number) => (
                    data.melanomaDoc.spot.slug == bodyPart.slug && data.gender == userData.gender  && (
                        
                            <Circle cx={data.melanomaDoc.location.x} cy={data.melanomaDoc.location.y} r="5" fill="red" key={`${"circle"}_${index}`} />
                        
                    )
                ))
            }
        </Svg>

    )
}

export const SlugCard = ({
    bodyPart,
    completedParts,
    handleNavigation,
    numberOfMolesOnSlugs,
    userData,
    melanomaData,
    index,
    skin_type
}:{
    bodyPart:BodyPart;
    completedParts: Slug[];
    handleNavigation:(path:string,data:any) => void;
    numberOfMolesOnSlugs: {Slug: number}[];
    userData: UserData;
    melanomaData: SpotData[];
    index:number;
    skin_type:SkinType;
}) => {
    return(
        <View style={[Mstyles.melanomaBox,styles_shadow.hightShadowContainer,!completedParts.includes(bodyPart.slug) ? {borderColor:"red"} : {borderColor:"lightgreen"}]} key={`box_${bodyPart.slug}_${index}`}>
        <Text style={{fontSize:20,fontWeight:"700",color:"white"}}>{bodyPart.slug}</Text>
        <Text style={{fontSize:15,fontWeight:"500",opacity:0.7,color:"white",marginBottom:10}}>Birthmarks: {getSlugCount(bodyPart.slug,numberOfMolesOnSlugs)}</Text>
        
        <View style={styles_shadow.hightShadowContainer}>
            {dotSelectOnPart(bodyPart,userData,melanomaData,skin_type)}
        </View>
        <TouchableOpacity style={[Mstyles.showMoreBtn,styles_shadow.shadowContainer]} onPress={() => handleNavigation("SlugAnalasis",bodyPart)}>
            <Text style={{fontSize:15,fontWeight:"500",opacity:0.7,color:"white"}}>See More</Text>
        </TouchableOpacity>
        {completedParts.includes(bodyPart.slug) ? <Text style={{color:"lightgreen",fontWeight:"500",opacity:0.5,fontSize:10,position:"absolute",bottom:10}}>Marked as complete</Text> : <Text style={{color:"red",fontWeight:"500",opacity:0.5,fontSize:10,position:"absolute",bottom:10}}>Not marked as complete</Text>}
        <View style={[Mstyles.redDotLabel,!completedParts.includes(bodyPart.slug) ? {backgroundColor:"red"} : {backgroundColor:"lightgreen"}]} />

    </View>
    )
}