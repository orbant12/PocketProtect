import { StyleSheet, View, Text,ScrollView,Image,TouchableOpacity,Dimensions } from "react-native";
import { NavBar_AssistantModal } from "../../components/Assist/navbarAssistantModal";
import { useRef,useState } from "react";
import { Rating } from 'react-native-stock-star-rating'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../../context/UserAuthContext";
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CheckoutScreen from "../../components/Payment/checkOutScreen"


const { width, height } = Dimensions.get('window');
const scaleFactor = width < 380 ? "50%" : "40%";

export const AssistModal = ({
    assistantData,
    setSelectedAssistant,
    bodyPart,
    navigation
}) => {

    const scrollRef = useRef(null)
    const paymentModalRef = useRef(null)

    const { currentuser } = useAuth()

    let checkOutData = {
        client: currentuser.uid,
        assistantData: assistantData,
        item:{
            type:"Mole Check",
            product:{
                [bodyPart.melanomaId]: bodyPart
            }
        }
    }


    return(
    <GestureHandlerRootView style={{ flex: 1,width:"100%",backgroundColor:"white" }}>
        <BottomSheetModalProvider>
    
        <ScrollView ref={scrollRef} style={{width:"100%",height:"100%"}}>
            <View style={styles.container}>
                <NavBar_AssistantModal 
                    scrollRef={scrollRef}
                    goBack={setSelectedAssistant}
                    bgColor={"transparent"}
                />
                <ProfileSection 
                    assistantData={assistantData}
                />
                <BioSection 
                    assistantData={assistantData}
                />
                
            </View>
        </ScrollView>
        <TouchableOpacity onPress={() => paymentModalRef.current.present()} style={{width:"90%",position:"absolute",padding:20,paddingVertical:15,bottom:30,justifyContent:"center",backgroundColor:"magenta",borderRadius:10,alignItems:"center",alignSelf:"center"}}>
            <Text style={{fontWeight:"600",color:"white"}}>Start Payment</Text>
        </TouchableOpacity>
        <BottomSheetModal
            ref={paymentModalRef}
            snapPoints={[scaleFactor]}
            enablePanDownToClose={true}
            handleStyle={{backgroundColor:"black",borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomWidth:2,height:10,color:"white"}}
            handleIndicatorStyle={{backgroundColor:"white"}}
            handleComponent={() => 
                <View style={{width:"100%",borderTopLeftRadius:5,borderTopRightRadius:10,padding:"4%",alignItems:"center",backgroundColor:"black",alignSelf:"center"}}>
                    <View style={{width:50,borderWidth:1.5,borderColor:"white"}}/>
                </View>       
            }
        >
        <PaymentStartView 
            checkOutData={checkOutData}
            bodyPart={bodyPart}
        />
       
        </BottomSheetModal>
        </BottomSheetModalProvider>
        </GestureHandlerRootView >
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:100,
        alignItems:"center"
    }
}) 


const ProfileSection = ({
    assistantData,
}) => {
    return(
        <View style={{alignItems:"center",width:"70%"}}>
        <Text style={{fontWeight:"700",fontSize:20}}>{assistantData.fullname}</Text>
        <Image 
            style={{width:150,height:150,borderRadius:10,marginTop:20}}
            source={{uri:assistantData.profileUrl}}
        />
        <View style={{width:"100%",alignItems:"center", flexDirection:"row",justifyContent:"space-between",marginTop:30}}>
            <DataTag 
                icon={{name:"heart"}}
                main={"150+"}
                sub={"Likes"}
            />
            <DataTag 
                icon={{name:"crown"}}
                main={"+10 years"}
                sub={"Experience"}
            />
            <DataTag 
                icon={{name:"star"}}
                main={"3.9"}
                sub={"Feedback"}
            />
        </View>
    </View>
    )
}

const DataTag = ({
    icon,
    main,
    sub
}) => {
    return(
        <View style={{alignItems:"center",justifyContent:"center"}}>
        <View style={{padding:10,borderRadius:100,backgroundColor:"rgba(0,0,0,0.1)"}}>
            <MaterialCommunityIcons 
                name={icon.name}
                size={30}
            />
        </View>
        <Text style={{marginVertical:10,fontSize:17,fontWeight:"600"}}>{main}</Text>
        <Text style={{fontWeight:"500",opacity:0.4,fontSize:13}}>{sub}</Text>
    </View>
    )
}

const BioSection = ({
    assistantData
}) => {
    return(
        <View style={{width:"100%",borderTopRightRadius:50,borderTopLeftRadius:50,backgroundColor:"rgba(0,0,0,0.01)",alignItems:"center",padding:10,marginTop:40,height:"100%"}}>
            <View style={{margin:10,alignItems:"center"}}>
                <Text style={{fontWeight:"800",fontSize:20}}>Dermotology Professional</Text>
                <Text style={{fontWeight:"700",fontSize:12,opacity:0.5}}>Graduated at: Valami</Text>
                <Rating 
                    stars={3.9}
                    maxStarts={5}
                    size={20}
                />
            </View>
            <View style={{marginTop:20}}>
                <Text style={{fontWeight:"700",marginBottom:15}}>About</Text>
                <Text style={{opacity:0.6}}>A msés kdmksm dkélmsékl dmkélsmlpkdmlksmkdlms klmdlk mskdmlks mdklms klmdksksm dkélmsékl dmkélsmlpkdmlksmkdlms klmdlk mskdmlks mdklms klmdlk smlkdm slkdmkls mdlksm kldmskl mdklsm dklsmlkdmdsljfgnkjsd  m dkélmsékl dmkélsmlpkdmlksmkdlms klmdlk mskdmlks mdklms klmdlk smlkdm slkdmkls mdlksm kldmskl mdklsm dklsmlkdmdsljfgnkjsd  lk smlkdm slkdmkls mdlksm kldmskl mdklsm dklsmlkdmdsljfgnkjsd nfjkndfljkfndfskjnfkjfdnfkjldnfjlk</Text>
            </View>
            <View style={{marginTop:30}}>
                <Text style={{fontWeight:"700",marginBottom:15}}>Client Feedback</Text>
                
            </View>
        </View>

    )
}

const PaymentStartView = ({
    checkOutData,
    bodyPart
}) => {
    return(
        <ScrollView>
        <View style={paymentStyles.container}>
            <Text style={{margin:20,fontSize:25,fontWeight:"800",alignSelf:"left"}}>Confirm</Text>
            <View style={{width:"100%",alignItems:"center",marginTop:20}}>
                <View style={paymentStyles.innerContainer}>
                <View>
                    <Text style={{fontWeight:"700"}}>{checkOutData.assistantData.fullname}</Text>
                    <Text style={{fontSize:12,marginTop:2}}>Service: {bodyPart.length} Mole Check</Text>
                </View>
                <Image 
                    style={paymentStyles.image}
                    source={{ uri: checkOutData.assistantData.profileUrl }} // Replace with your image source
                />
                </View>
                <View style={{width:"70%",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginRight:10,marginTop:10}}>
                    <MaterialCommunityIcons 
                        name="lock"
                        size={15}
                        color={"gray"}
                        style={{marginRight:10}}
                    />
                    <Text style={{maxWidth:"100%",fontSize:10,opacity:0.6}}>All Payments are handled by Stripe. Which is one of the safest and trusted way to handle digital purchases! </Text>
                </View>
            </View>
            <View style={{width:"100%",alignItems:"center",marginTop:30}}>
                <View style={{width:"85%",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:15}}>
                    <Text style={{fontWeight:"600"}}>Total Ammount</Text>
                    <Text>{bodyPart.length * 5} €</Text>
                </View>
                
                <CheckoutScreen 
                    checkOutData={checkOutData}
                    price={bodyPart.length * 5}
                />
            </View>
      </View>
      </ScrollView>
    )
}

const paymentStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:"space-between",
      alignItems:"center",
      width:"100%",
      height:"100%"
    },
    innerContainer: {
      flexDirection: 'row',
      paddingHorizontal:20,
      borderRadius:10,
      paddingVertical:10,
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
      alignSelf: 'center',
      backgroundColor: '#fff', // Ensure a background color is set for the shadow to be visible
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, 
      marginTop:-20
    },
    image: {
      borderWidth: 1,
      height: 50,
      width: 50,
      borderRadius: 25, // Half of the width/height to make it a circle
    },
  });