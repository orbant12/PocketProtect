
import { View,StyleSheet, Text, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react";
import { ExplainPageComponent_Type1, ExplainPageComponent_Type2, ProgressRow } from "./explainPage";
import { SkinTypeScreen } from "../../pages/Libary/Melanoma/ProcessScreens/Fullprocess/skinSelect";
import { SkinType } from "../../utils/types";
import { fetchSkinType, updateSkinType } from "../../services/server";
import { useAuth } from "../../context/UserAuthContext";
import { SelectionPage } from "../Common/SelectableComponents/selectPage";


export const MedicalData_Add_View = ({handleClose}) => {

    const AllergieArray = [
        {value:"food",title:"Food Allergies"},
        {value:"enviroment",title:"Enviroment Allergies"},
        {value:"contant",title:"Contact Allergies"},
        {value:"seasonal",title:"Seasonal Allergies"},
        {value:"drug",title:"Drug Allergies"},
        {value:"other",title:"Other Allergies"},
    ]

    const [progress, setProgress] = useState(0.1);
    const { currentuser } = useAuth()
    const [activeNavItem, setActiveNavItem] = useState(AllergieArray[0].value)



    const [medicalData, setMedicalData] = useState({
        allergies:[
     
        ],
    })

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

    const handleSaveData = async () => {
        await updateMedicalData({
            newData: medicalData,
            userId: currentuser.uid
        })
    }

    const handleLoad = async ()  => {
        const response = await fetchMedicalData({
            userId: currentuser.uid
        })
        setMedicalData(response)
    }

    useEffect(() => {
        handleLoad()
    },[])

    return(
        <View style={[styles.container,{height:"80%",justifyContent:"space-between",marginBottom:"5%"}]}>
                <View style={[{width:"100%",height:"85%",flexDirection:"column",justifyContent:"space-between"}]}>
                    {round(progress,1) == 0.1 && <SelectionPage 
                        pageTitle="Allergies"
                        selectableOption="box"
                        desc="Please select the allergies you have"
                        pageStyle={{height:"95%",marginTop:"5%"}}
                        selectableData={[
                            {title:"None",icon:{type:"icon",metaData:{name:"close",size:30} },type:"none",container:"all"},
                            //FOOG ALLERGIES
                            {title:"Peanuts",icon:{type:"icon",metaData:{name:"peanut-outline",size:30} },type:"peanuts",container:"food"},
                            {title:"Tree nuts",icon:{type:"icon",metaData:{name:"nutrition",size:30} },type:"tree_nuts",container:"food"},
                            {title:"See Food",icon:{type:"icon",metaData:{name:"jellyfish-outline",size:30} },type:"see_food",container:"food"},
                            {title:"Fish",icon:{type:"icon",metaData:{name:"fish",size:30} },type:"fish",container:"food"},
                            {title:"Milk",icon:{type:"icon",metaData:{name:"bottle-soda-classic-outline",size:30} },type:"milk",container:"food"},
                            {title:"Eggs",icon:{type:"icon",metaData:{name:"egg-fried",size:30} },type:"eggs",container:"food"},
                            {title:"Soy",icon:{type:"icon",metaData:{name:"soy-sauce",size:30} },type:"soy",container:"food"},
                            {title:"Wheat",icon:{type:"icon",metaData:{name:"grass",size:30} },type:"wheat",container:"food"},
                            //DRUG ALLERGIES
                            {title:"Penicillin",icon:{type:"icon",metaData:{name:"pill",size:30} },type:"penicillin",container:"drug"},
                            {title:"Sulfa drugs",icon:{type:"icon",metaData:{name:"pill",size:30} },type:"sulfa",container:"drug"},
                            {title:"Anesthetics",icon:{type:"icon",metaData:{name:"medical-bag",size:30} },type:"aneshetics",container:"drug"},
                            {title:"Aspirin",icon:{type:"icon",metaData:{name:"pill",size:30} },type:"aspirin",container:"drug"},
                            //ENVIROMENT ALLERGIES
                            {title:"Pollen",icon:{type:"icon",metaData:{name:"flower",size:30} },type:"pollen",container:"enviroment"},
                            {title:"Dust mites",icon:{type:"icon",metaData:{name:"home",size:30} },type:"dust_mites",container:"enviroment"},
                            {title:"Mold",icon:{type:"icon",metaData:{name:"mushroom",size:30} },type:"mold",container:"enviroment"},
                            {title:"Pet dander",icon:{type:"icon",metaData:{name:"dog",size:30} },type:"pet_dander",container:"enviroment"},
                            {title:"Insect stings",icon:{type:"icon",metaData:{name:"bee",size:30} },type:"insect_stings",container:"enviroment"},
                            //CONTACT ALLERGIES
                            {title:"Latex",icon:{type:"icon",metaData:{name:"hand-back-left",size:30} },type:"latex",container:"contant"},
                            {title:"Certain metals",icon:{type:"icon",metaData:{name:"diamond-stone",size:30} },type:"nickel",container:"contant"},
                            {title:"Fragrances",icon:{type:"icon",metaData:{name:"spray",size:30} },type:"fragrances",container:"contant"},
                            {title:"Specific chemicals",icon:{type:"icon",metaData:{name:"flask-empty",size:30} },type:"specific_chemicals",container:"contant"},
                            //SEASONAL ALLERGIES
                            {title:"Ragweed",icon:{type:"icon",metaData:{name:"flower",size:30} },type:"ragweed",container:"seasonal"},
                            {title:"Grass",icon:{type:"icon",metaData:{name:"grass",size:30} },type:"grass",container:"seasonal"},
                            {title:"Tree pollen",icon:{type:"icon",metaData:{name:"tree",size:30} },type:"tree_pollen",container:"seasonal"},
                            //OTHER ALLERGIES
                            {title:"Food additives",icon:{type:"icon",metaData:{name:"food-apple",size:30} },type:"food_additives",container:"other"},
                            {title:"Certain preservatives",icon:{type:"icon",metaData:{name:"food-apple",size:30} },type:"preservatives",container:"other"},


                        ]}
                        setOptionValue={(value) => !medicalData.allergies.includes(value) ?  (
                            value == "none" ? setMedicalData({...medicalData,allergies:["none"]}) : 
                                medicalData.allergies.includes("none") ? setMedicalData({...medicalData,allergies:[value]}) : setMedicalData({...medicalData,allergies:[...medicalData.allergies,value]})
                            )
                                :
                            (
                                //DELETE EXISTING VALUE FROM ARRAY
                                medicalData.allergies.splice(medicalData.allergies.indexOf(value),1),
                                setMedicalData({...medicalData,allergies:medicalData.allergies})
                                    
                            )
                            }
                        optionValue={medicalData.allergies}
                        setProgress={setProgress}
                        buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.1}}}
                        showButton={false}
                        isMap={true}
                        topPager={{
                            activeItem:activeNavItem,
                            setActiveItem: setActiveNavItem,
                            navItems:AllergieArray
                        }}

                    />
                    }
                    {round(progress,1) == 0.2 && <ExplainPageComponent_Type2 
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
                <View style={{width:"100%",alignItems:"center"}}>
                    <TouchableOpacity onPress={() => setProgress(progress + 0.1)} style={{width:"90%",padding:15,flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"magenta",borderRadius:10}}>
                        <Text style={{fontWeight:"700",fontSize:14,color:"white"}} >Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setProgress(progress - 0.1)} style={{width:"90%",padding:10,flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"transparent",borderRadius:10,marginTop:10,borderWidth:0.3}}>
                        <Text style={{fontWeight:"700",fontSize:14,color:"black"}} >Back</Text>
                    </TouchableOpacity>
                </View>
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