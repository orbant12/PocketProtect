import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SelectionPage_Binary } from "../../../../../components/Common/SelectableComponents/selectPage_Binary";
import { ScrollView, Text,Pressable,View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SkinDataType } from "../../../../../utils/types";
import { MelanomaMetaData } from "../../melanomaCenter";


export function FamilyTreeScreen({
    handleMelanomaDataChange,
    melanomaMetaData,
    setProgress,
    progress,   
    styles

}:{
    handleMelanomaDataChange:(type: "detected_relative",value:string) => void;
    melanomaMetaData:MelanomaMetaData;
    setProgress:(progress:number) => void;
    progress:number;
    styles:any;
}){

        
    const familyMemberOptions = [
        {
            member:"father",
            icon: "face-man",
        },
        {
            member:"grandfather",
            icon:"human-cane"
        },
        {
            member:"mother",
            icon:"face-woman"
        },
        {
            member:"sibling",
            icon:"face-woman-shimmer-outline"
        },
        {
            member:"grandmother",
            icon:"human-female-dance"
        },
        {
            member:"other",
            icon:"apple-keyboard-command"
        }
    ]
    const bottomSheetRef = useRef(null);

    const handleOpenBottomSheet = (state:"open" | "hide") => {
        if(state == "open"){
            bottomSheetRef.current.present();
        } else if (state == "hide"){
            bottomSheetRef.current.close();
            setProgress(progress + 0.1)
        }
    }

    return(
    <GestureHandlerRootView style={{ flex: 1,zIndex:-1,width:"100%" }}>
        <BottomSheetModalProvider>
            <SelectionPage_Binary 
                pageTitle={{text:() => <Text style={{fontWeight:"700",fontSize:21,textAlign:"center",}}>Has anyone in your family been diagnosed with <Text style={{color:"magenta"}}>Melanoma </Text> before ?</Text>}}                    
                setProgress={(e) => e == true ? handleOpenBottomSheet("open"):setProgress(progress + 0.1)}
            />

            <BottomSheetModal
                    ref={bottomSheetRef}
                    snapPoints={["65%"]}
                    enablePanDownToClose={true}
                    handleStyle={{backgroundColor:"black",borderTopLeftRadius:5,borderTopRightRadius:5,borderBottomWidth:2,height:40}}
                    handleIndicatorStyle={{backgroundColor:"white"}}
                    containerStyle={{height:"100%",width:"100%"}}
                >
                    <View style={{width:"100%",alignItems:"center",flexDirection:"column",backgroundColor:"#fff",padding:10,marginTop:"10%",height:"90%",justifyContent:"space-between"}}>
                        <View style={{backgroundColor:"rgba(0,0,0,0.1)",padding:10,borderRadius:10}}>
                            <Text style={{fontWeight:"700",textAlign:"center",fontSize:20}}>Please select whom from your family had been diagnosed ...</Text>
                        </View>
                        <ScrollView horizontal style={{width:"100%",marginTop:30}} contentContainerStyle={{height:10}} showsHorizontalScrollIndicator={false}>
                            {familyMemberOptions.map((data) => (
                                <Pressable key={data.member} onPress={() => handleMelanomaDataChange("detected_relative",data.member)} style={melanomaMetaData.detected_relative.includes(data.member) ? styles.selectableBubbleA : styles.selectableBubble} >
                                    <MaterialCommunityIcons
                                        name={data.icon}
                                        size={25}
                                        style={{marginBottom:10}}
                                        color={"white"}
                                    />
                                    <Text style={{fontWeight:"700",color:"white",fontSize:16}}>{data.member}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                        <Pressable onPress={() => handleOpenBottomSheet("hide")} style={{marginTop:0,borderWidth:1,borderRadius:8,width:"80%",height:50,alignItems:"center",justifyContent:"center",backgroundColor:"black"}}>
                            <Text style={{fontWeight:"700",color:"white"}}>Done</Text>
                        </Pressable>
                    </View>
                </BottomSheetModal>
        </BottomSheetModalProvider>
    </GestureHandlerRootView >
    )
}