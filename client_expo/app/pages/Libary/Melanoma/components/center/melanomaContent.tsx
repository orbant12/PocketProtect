import { ScrollView, Text, TouchableOpacity, View, Pressable } from "react-native";
import { BodyPart, SkinType, Slug, SpotData, UserData } from "../../../../../utils/types";
import { MelanomaMetaData } from "../../melanomaCenter";
import { Mstyles } from "../../../../../styles/libary_style";
import { OneOptionBox } from "../../../../../components/LibaryPage/Melanoma/boxes/oneOptionBox";
import { AssistantAdvertBox } from "../../../../../components/LibaryPage/Melanoma/Assistance/assistantAdvert";
import { SlugCard } from "../../../../../components/LibaryPage/Melanoma/slugCard";
import { Navigation_SlugAnalysis } from "../../../../../navigation/navigation";
import { SkinNumber_Convert } from "../../../../../utils/skinConvert";
import { styles_shadow } from "../../../../../styles/shadow_styles";
import { LinearGradient } from 'expo-linear-gradient';
import Body from "../../../../../components/LibaryPage/Melanoma/BodyParts/index";


export const MelanomaContent = ({
    navigation,
    affectedSlugs,
    selectedSide,
    setSelectedSide,
    melanomaMetaData,
    setSkinModal,
    skinModal,
    userData,
    melanomaData,
    bodySlugs,
    completedParts,
    handleAddMelanoma,
    handleNavigation,
    numberOfMolesOnSlugs,
}:{
    navigation:any;
    affectedSlugs:{slug: Slug}[];
    selectedSide:"front" | "back";
    setSelectedSide:Function;
    melanomaMetaData:MelanomaMetaData;
    setSkinModal:Function;
    skinModal:boolean;
    melanomaData:SpotData[];
    bodySlugs:BodyPart[];
    userData:UserData;
    completedParts: Slug[];
    handleAddMelanoma:() => void;
    handleNavigation:(path:string,data:any) => void;
    numberOfMolesOnSlugs: {Slug: number}[];
}) => {

    return(
        <View style={Mstyles.container}>   
        <LinearGradient
            colors={['white', '#fc8bfb','white']}
            locations={[0.1,0.90,0.6]}        
            style={{width:"100%",alignItems:"center"}}
        >      
        <View style={Mstyles.melanomaTitle}>
            <View style={Mstyles.melanomaTitleLeft}>
                <Text style={Mstyles.melanomaTag}>AI Vision</Text>
                <Text style={{fontSize:20,fontWeight:"700"}}>Melanoma Monitoring</Text>
                <Text style={{fontSize:12,maxWidth:"100%",opacity:0.4,marginTop:5,fontWeight:"500"}}>Click on the body part for part analasis</Text>   
            </View>       
            <TouchableOpacity onPress={() => setSkinModal(!skinModal)} style={[{width:50,height:50,backgroundColor:`${melanomaMetaData.skin_type != undefined ? SkinNumber_Convert(melanomaMetaData.skin_type) : "white"}`,borderRadius:100,borderWidth:3,borderColor:"white"},styles_shadow.shadowContainer]} />
        </View>
        <View style={styles_shadow.shadowContainer}>
            <Body
                data={affectedSlugs}
                gender={userData.gender}
                side={selectedSide}
                scale={1.1}
                colors={['#FF0000','#A6FF9B','#FFA8A8']}
                onBodyPartPress={(slug) => Navigation_SlugAnalysis({
                    bodyPartSlug: slug,
                    skin_type: melanomaMetaData.skin_type as SkinType,
                    navigation
                })}
                skinColor={melanomaMetaData.skin_type}
            />
        </View>

        <View style={[Mstyles.colorExplain,{top:300}]}>
            <View style={Mstyles.colorExplainRow} >
                <View style={Mstyles.redDot} />
                <Text style={{position:"relative",marginLeft:10,fontWeight:"500",opacity:0.8}}>Higher risk</Text>
            </View>

            <View style={Mstyles.colorExplainRow}>
                <View style={Mstyles.greenDot} />
                <Text style={{position:"relative",marginLeft:10,fontWeight:"500",opacity:0.8}}>No risk</Text>
            </View>
        </View>

        <View style={[Mstyles.positionSwitch,styles_shadow.shadowContainer]}>
            <Pressable onPress={() => setSelectedSide("front")}>
                <Text style={selectedSide == "front" ? {fontWeight:"600"}:{opacity:0.5}}>Front</Text>
            </Pressable>
            <Text>|</Text>
            <Pressable onPress={() => setSelectedSide("back")}>
                <Text style={selectedSide == "back" ? {fontWeight:"600"}:{opacity:0.5}}>Back</Text>
            </Pressable>
        </View>                      
        </LinearGradient>                    

        <View style={Mstyles.analasisSection}>
            <Pressable onPress={handleAddMelanoma} style={[Mstyles.AddMelanomaBtn]}>
                <View style={[{borderRadius:10,backgroundColor:"black",width:"100%",alignItems:"center",justifyContent:"center",height:"100%"},styles_shadow.shadowContainer]}>                                         
                    <Text style={{color:"white",opacity:0.5,fontWeight:"600",fontSize:10,marginBottom:5}}>Click to registe a new mole</Text>
                    <Text style={{color:"white",fontWeight:"700",fontSize:17,opacity:0.8}}>
                        + Add New Mole
                    </Text>
                </View>
            </Pressable>
            <View style={[Mstyles.melanomaTitle,{marginTop:50,marginBottom:30}]}>
                <View style={Mstyles.melanomaTitleLeft}>
                    <Text style={{fontSize:12,opacity:0.5,fontWeight:"500"}}>Open them for analasis results</Text>   
                    <Text style={{fontSize:20,fontWeight:"700"}}>Your Moles</Text>                                    
                </View>

            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                {bodySlugs != null &&  (
                    bodySlugs.map((bodyPart,index) => (
                        <SlugCard
                            handleNavigation={handleNavigation}
                            bodyPart={bodyPart}
                            userData={userData}
                            completedParts={completedParts}
                            numberOfMolesOnSlugs={numberOfMolesOnSlugs}
                            melanomaData={melanomaData}
                            index={index}
                            key={`box_${bodyPart.slug}_${index}`}
                            skin_type={melanomaMetaData.skin_type}
                        />
                    ))
                )}
            </ScrollView>
        </View>

        <RelatedBoxesContainer 
            navigation={navigation}
        />

        <LearnBoxesContainer 
            navigation={navigation}
        />

    </View>   
    )
}


const RelatedBoxesContainer = ({navigation}) => {
    return(
        <>
        <View style={[Mstyles.melanomaTitle,{marginTop:0,marginBottom:30}]}>
        <View style={Mstyles.melanomaTitleLeft}>
            <Text style={{fontSize:12,opacity:0.5,fontWeight:"500"}}>Open them for analasis results</Text>   
            <Text style={{fontSize:20,fontWeight:"700"}}>Prevent Skin Cancer</Text>                                    
        </View>
    </View>

    <View style={Mstyles.educationSection}>
        <OneOptionBox 
            navigation={navigation}
            stw={180}
            buttonTitle="Register New !"
            subTitle="Sunburn significantly increases the risk of skin cancer"
            mainTitle="Your Skin Data"
            image={require("../../../../../assets/type.png")}
            bgColor={"black"}
            textColor={"white"}
            id="skin_data"
        />

        <OneOptionBox 
            navigation={navigation}
            stw={180}
            buttonTitle="Register New !"
            subTitle="Sunburn significantly increases the risk of skin cancer"
            mainTitle="Track Sun Burn"
            image={require("../../../../../assets/burn.png")}
            bgColor={"orange"}
            id="sun_burn"
        />

        <OneOptionBox 
            navigation={navigation}
            buttonTitle="How it works ?"
            subTitle="100% Transparency - Open Source"
            mainTitle="Our AI Model"
            image={require("../../../../../assets/ai.png")}
            bgColor="white"
            id="ai_model"
        />

        <AssistantAdvertBox 
            navigation={navigation}
        />

    </View>
    </>
    )
}

const LearnBoxesContainer = ({navigation}) => {
    return(
        <>
        <View style={[Mstyles.melanomaTitle,{marginTop:70,marginBottom:30}]}>
        <View style={Mstyles.melanomaTitleLeft}>
            <Text style={{fontSize:12,opacity:0.5,fontWeight:"500"}}>Open them for analasis results</Text>   
            <Text style={{fontSize:20,fontWeight:"700"}}>Learn about skin cancer</Text>                                    
        </View>
    </View>

    <View style={Mstyles.educationSection}>
        <OneOptionBox 
            navigation={navigation}
            buttonTitle="Start Learning"
            subTitle="ABCDE Rule"
            mainTitle="Detect Skin Cancer"
            image={require("../../../../../assets/abcde.png")}
            bgColor="white"
            id="abcde"
        />

        <OneOptionBox 
            navigation={navigation}
            buttonTitle="How it works ?"
            subTitle="100% Transparency - Open Source"
            mainTitle="Our AI Model"
            image={require("../../../../../assets/ai.png")}
            bgColor="white"
            id="ai_model"
        />

        <OneOptionBox 
            navigation={navigation}
            stw={180}
            buttonTitle="Register New !"
            subTitle="Sunburn significantly increases the risk of skin cancer"
            mainTitle="Your Skin Data"
            image={require("../../../../../assets/type.png")}
            bgColor={"black"}
            textColor={"white"}
            id="skin_data"
        />

    </View>
    </>
    )
}