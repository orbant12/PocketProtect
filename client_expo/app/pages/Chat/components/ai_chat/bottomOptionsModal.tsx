import { Image, Modal, TouchableOpacity,View } from "react-native";
import { ContextToggleType } from "../../../../utils/types";
import { ContextPanel } from "../../../../components/Assist/contextSheet";
import { Text } from "react-native";
import { PagerComponent } from "../../../../components/Common/pagerComponent";
import { QuestionsSheet } from "./questionModal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const maleDefault = Image.resolveAssetSource(require("../../../../assets/male.png")).uri;

export const BottomOptionsModal = ({selectedType, setSelectedType,contextToggles,setContextToggles,handleStartChat,userContexts}:{
    selectedType: null | "context" | "help" | "questions";
    setSelectedType:(e:null | "context" | "help" | "questions") => void;
    contextToggles:ContextToggleType;
    setContextToggles:(e:ContextToggleType) => void;
    handleStartChat:(arg:string,c_t:"blood_work" | "uv" | "medical" | "bmi" | "weather") => void;
    userContexts: any;
  }) => {
    return(
      <Modal visible={selectedType != null} presentationStyle="formSheet" animationType='slide'>
        <TouchableOpacity onPress={() => setSelectedType(null)} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.86)",borderWidth:2,borderColor:"gray",paddingVertical:10,borderRadius:10,width:"100%",alignSelf:"center",borderBottomLeftRadius:0,borderBottomRightRadius:0}}>
          <MaterialCommunityIcons 
            name='close'
            size={25}
            color={"white"}
          />
          <Text style={{color:"white",fontWeight:"800",fontSize:16,marginLeft:10,marginRight:10}}>Close</Text>
        </TouchableOpacity>
  
        {selectedType == "context" &&
          <ContextPanel 
            contextToggles={contextToggles}
            setContextToggles={setContextToggles}
            userContexts={userContexts}
          />
        }
        {selectedType == "help" &&
        <View style={{width:"100%"}}>
          <PagerComponent 
                  indicator_position={{backgroundColor:"black",padding:15}}
                  dotColor={"white"}
                  pagerStyle={{height:"80%",borderWidth:3,width:"90%",marginTop:"10%",alignSelf:"center",borderRadius:10}}
                  pages={[
                      {pageComponent:() =>
                          <Image
                              source={{uri: maleDefault}}
                              style={{width:"100%",height:"100%",objectFit:"contain"}}
                          />
                      },
                      {pageComponent:() =>
                      <Image
                          source={{uri: maleDefault}}
                          style={{width:"100%",height:"100%",objectFit:"contain"}}
                      />
                      }
                  ]}
                /> 
        </View>
        }
        {selectedType == "questions" &&
          <QuestionsSheet 
            handlePreQuestion={(e:string,c_t:"blood_work" | "uv" | "medical" | "bmi" | "weather") => handleStartChat(e,c_t)}
          />
        }
      </Modal>
    )
  }