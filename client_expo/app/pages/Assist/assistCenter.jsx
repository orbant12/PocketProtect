import {Image, StyleSheet, View, Text,ScrollView,TouchableOpacity,Modal } from "react-native";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { Rating } from 'react-native-stock-star-rating'
import medic1 from "../../assets/assist/assistant.png"
import medical from "../../assets/assist/medic.png"
import { NavBar_TwoOption } from "../../components/Common/navBars";
import { AssistTab } from "../../components/LibaryPage/Melanoma/SingleMole/tabs/assistTab";
import { fetchAssistantsByField } from "../../services/server";
import { ManualAdd_Moles } from "../../components/Assist/manualMoleScreen";

const AssistCenter = ({navigation}) => {

    const [activeItem, setActiveItem] = useState("skin")
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [properAssistants, setProperAssistants] = useState([])

    const fetchAssistants = async () => {
        const response = await fetchAssistantsByField({
            field:"dermotology"
        })
        setProperAssistants(response)
    }

    useEffect(() => {
        fetchAssistants()
    },[])

    return(
        <View style={styles.container}>
            <ScrollView style={{width:"100%"}} contentContainerStyle={{alignItems:"center"}}>
                <NavBar_TwoOption 
                    title={"Hire Help"}
                    icon_left={{
                        name:"arrow-left",
                        size:25,
                        action:() => navigation.goBack()
                    }}
                    icon_right={
                        {
                            name:"magnify",
                            size:25
                        }
                    }
                />
                <View style={{width:"90%",backgroundColor:"magenta",marginTop:20,borderRadius:20,height:150,flexDirection:"row",alignItems:"center",overflow:"hidden"}}>
                    
                    <Text style={{width:"80%", fontWeight:"800",fontSize:20,padding:10,color:"white",zIndex:10}}>Get Professional Analasis from trained doctors with medical degrees</Text>
                    
                    <Image 
                        source={medical}
                        style={{width:"50%",height:150,marginLeft:0,position:"absolute",opacity:0.2,right:0}}
                    />
                </View>
                <Navbar_Selectable 
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                />
                <Shop_Container 
                    setSelectedProduct={setSelectedProduct}
                />
            </ScrollView>
            <Shop_Modal 
                selectedProduct={selectedProduct}
                navigation={navigation}
                properAssistants={properAssistants}
                setSelectedProduct={setSelectedProduct}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:"100%",
        height:"100%", 
        alignItems:"center",
    },
    navItem:{
        
        fontWeight:"600",
        fontSize:15,
        opacity:0.3
    },
    shopItem:{
        width:"98%",
        padding:15,
        borderWidth:1,
        flexDirection:"row",
        alignItems:"center",
        borderRadius:20,
        marginBottom:50,
        backgroundColor:"rgba(0,0,0,1)"
    }
}) 

export default AssistCenter;


export const Navbar_Selectable = ({
    setActiveItem,
    activeItem,
    navItems = [{value:"skin",title:"Skin Cancer"},{value:"blood",title:"Blood Check"},{value:"soon",title:"Coming More Soon ..."}]
}) => {
    return(
        <View style={{width:"100%",height:80}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{width:"100%",height:80}}>
            <View style={{width:"100%",alignItems:"center",flexDirection:"row",marginRight:20,height:80,borderWidth:0}}>
                {navItems.map((data,index) => (
                <NavItem 
                    setActiveItem={setActiveItem}
                    value={data.value}
                    title={data.title}
                    activeItem={activeItem}
                />
                ))}
            </View>
            </ScrollView>
        </View>
    )
}

const NavItem = ({
    title,
    value,
    activeItem,
    setActiveItem,
}) => {
    return(
        <TouchableOpacity style={{alignItems:"center",marginLeft:20}} onPress={() => setActiveItem(value)}>
            <View style={activeItem == value && {opacity:1,backgroundColor:"rgba(0,0,0,0.9)",alignItems:"center",justifyContent:"center",paddingHorizontal:10,paddingVertical:5,borderRadius:100}}>
                <Text style={[styles.navItem, activeItem == value && {opacity:1 ,color:"white"}]}>{title}</Text>
            </View>
            <View style={[{width:6,height:6,backgroundColor:"black",borderRadius:100,marginTop:6,marginLeft:0,opacity:0},activeItem == value && {opacity:0.9}]} />
        </TouchableOpacity>
    )
}

const Shop_Container = ({
    setSelectedProduct
}) => {
    return(
        <View style={{width:"100%",padding:10,flexDirection:"column",alignItems:"center",borderWidth:0}}>
            <ShopItem 
                price={"5 $ / Mole"}
                productTitle={"Mole Check"}
                serviceBars={[
                    {
                        icon:{name:"newspaper-variant-outline"},
                        text:"PDF of the full analasis"
                    },
                    {
                        icon:{name:"help-rhombus-outline"},
                        text:"Personal advice & concerns"
                    },
                    {
                        icon:{name:"android-messages"},
                        text:"Chat access with your choosen Dermotologist"
                    },
                ]}
                bottomInfoText={"Your Choosen Dermotologist will do a professional mole analasis. You will recive a detailed PDF stating your results and further concerns, advices"}
                productImageUrl={""}
                setSelectedProduct={setSelectedProduct}
            />
                        <ShopItem 
                price={"30 $"}
                productTitle={"Full Body Analasis"}
                serviceBars={[
                    {
                        icon:{name:"newspaper-variant-outline"},
                        text:"PDF of the full analasis"
                    },
                    {
                        icon:{name:"help-rhombus-outline"},
                        text:"Personal advice & concerns"
                    },
                    {
                        icon:{name:"android-messages"},
                        text:"Chat access with your choosen Dermotologist"
                    },
                ]}
                bottomInfoText={"Your Choosen Dermotologist will do a professional mole analasis. You will recive a detailed PDF stating your results and further concerns, advices"}
                productImageUrl={""}
                setSelectedProduct={setSelectedProduct}
            />
        </View>
    )
}

const ShopItem = ({
    price,
    productTitle,
    serviceBars,
    bottomInfoText,
    productImageUrl,
    setSelectedProduct
}) => {
    return(
        <View style={styles.shopItem}>

            <View style={{marginLeft:0,maxWidth:"100%",minWidth:"100%",alignItems:"center"}}>
                <Text style={{fontWeight:"600",fontSize:21,color:"white",alignSelf:"left"}}>{productTitle}</Text>
                <View style={{position:"absolute",right:-16,padding:10,backgroundColor:"white",borderRadius:10,top:-16,borderWidth:1,borderBottomRightRadius:0,borderTopLeftRadius:0}}>
                    <Text style={{fontWeight:"600",fontSize:18,color:"black",opacity:0.8}}>{price}</Text>
                </View>
                <View style={{width:"100%",marginVertical:20,flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(255,255,255,0.08)",padding:10,borderRadius:10,marginTop:30}}>
                    <View style={{marginLeft:0,width:"60%"}}>
                        <Text style={{fontWeight:"600",color:"white",fontSize:16,marginBottom:10}}>What you'll get:</Text>
                        {serviceBars.map((data,index) => (
                            <View key={index} style={{flexDirection:"row",alignItems:"center",opacity:0.6,marginVertical:6}}>
                                <MaterialCommunityIcons 
                                    name={data.icon.name}
                                    color={"white"}
                                    size={15}
                                    
                                />
                                <Text style={{color:"white",marginLeft:10,fontSize:12,width:"80%"}}>{data.text}</Text>
                            </View>
                        ))}
                    </View>
                    <Image 
                        style={{width:120,height:120,borderRadius:20,borderWidth:1,borderColor:"white"}}
                        source={productImageUrl}
                    /> 
                </View>
                <View style={{flexDirection:"row",width:"100%",alignItems:"center"}}>
                    <MaterialCommunityIcons 
                        name="information"
                        color={"white"}
                        opacity={0.5}
                        size={20}
                    />
                    <Text style={{marginTop:5,opacity:0.5,color:"white",fontSize:12,marginLeft:10,width:"90%"}}>{bottomInfoText}</Text>
                </View> 
                <View style={{width:"80%",marginTop:15,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row",width:80}}>
                        <Image 
                            style={{width:30,height:30,borderRadius:100,borderWidth:1,borderColor:"white",}}
                            source={medic1}
                        />
                        <Image 
                            style={{width:30,height:30,borderRadius:100,borderWidth:1,borderColor:"white",marginLeft:-10}}
                            source={medic1}
                        />
                        <Image 
                            style={{width:30,height:30,borderRadius:100,borderWidth:1,borderColor:"white",marginLeft:-10}}
                            source={medic1}
                        />
                    </View>

                    <View style={{alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"white",fontWeight:"600",fontSize:10}}>
                            4,9
                        </Text>
                        <Rating 
                            stars={1}
                            maxStarts={4}
                            size={13}
                        />
                        <Text style={{color:"white",fontSize:10,fontWeight:"700"}}>Highly Trained Team</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedProduct(productTitle)} style={{alignItems:"center",justifyContent:"center",padding:10,width:"100%",backgroundColor:"magenta",borderRadius:10,marginTop:15}}>
                    <MaterialCommunityIcons 
                        name="plus"
                        size={20}
                        color={"white"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Shop_Modal = ({
    selectedProduct,
    properAssistants,
    navigation,
    setSelectedProduct,
}) => {
    return(
        <Modal animationType="slide" visible={selectedProduct != null}>
            <ManualMole_ModalScreen 
                show={selectedProduct}
                properAssistants={properAssistants}
                setSelectedProduct={setSelectedProduct}
                navigation={navigation}
            />
        </Modal>
    )
}

const ManualMole_ModalScreen = ({
    show,
    setSelectedProduct,
    navigation
}) => {
    return(
        <>
        {show == "Mole Check" &&
            <ManualAdd_Moles 
                closeAction={() => setSelectedProduct(null)}
                navigation={navigation}
            />
        }
        </>
    )
}