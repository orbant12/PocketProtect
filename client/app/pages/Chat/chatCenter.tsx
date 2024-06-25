import { View,Text,TouchableOpacity,Modal,ScrollView,RefreshControl } from "react-native"
import { SessionBar } from "../../components/Assist/sessionBar"
import { AssistPanel_style } from "../../styles/assistance_style"
import { ChatSessionModal } from "../../components/Assist/chatSessionModal"
import { useAuth } from "../../context/UserAuthContext"
import { useState, useEffect, useCallback } from "react"
import { fetchAssistantSessions } from "../../services/server"
import { NavBar_TwoOption } from "../../components/Common/navBars"
import { ChatBotBar } from "../../components/Assist/Bots/chatBotBar.js"
import { Navigation_AI_Assistant } from "../../navigation/navigation"
import robotAi from "../../assets/assist/robotAI.png"
import { AssistantAdvertBox } from "../../components/LibaryPage/Melanoma/Assistance/assistantAdvert"

const ChatCenter = ({navigation}) => {

    const [ selectedChat, setSelectedChat] = useState([])
    const {currentuser} = useAuth();
    const [assistSessions, setAssistSessions] = useState([])
    const [ activeBubble, setActiveBubble] = useState("assist")
    const [refreshing, setRefreshing] = useState(false);

    const AI_Doctors_Data = [
        {
            name:"AI Medical Assistant",
            profileUrl:robotAi,
            desc:"",
            tags:[
                {icon_name:"brain",text:"AI can see your Medical Data like: Blood Work, BMI or additional vital medical information you've provided ..."},
            ],
            action:() => Navigation_AI_Assistant({navigation})
        }
    ]

    const fetchAllAssistantSession = async () => {
        const response = await fetchAssistantSessions({
            userId: currentuser.uid
        })
        setAssistSessions(response)
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAllAssistantSession()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    }, []);


    useEffect(() => {
        fetchAllAssistantSession()
    },[selectedChat])

    return(
        <View style={AssistPanel_style.container}>
            <NavBar_TwoOption 
                title={"Chats"}
                icon_left={{name:"arrow-left",size:25}}
                icon_right={{name:"image",size:25}}
            />
            <AssistantAdvertBox 
                navigation={navigation}
            />
            <Bubble_NavBar 
                setActiveBubble={setActiveBubble}
                activeBubble={activeBubble}
            />
            <ScrollView 
                style={{width:"100%",height:"100%"}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['magenta']}
                        tintColor={'magenta'}
                    />
                }
            >
                <AssistantChatLogs 
                    activeBubble={activeBubble}
                    assistSessions={assistSessions}
                    setSelectedChat={setSelectedChat}
                />
                <AiChatLogs 
                    activeBubble={activeBubble}
                    AI_Doctors_Data={AI_Doctors_Data}
                />
            </ScrollView>
            <Modal animationType="slide" visible={selectedChat.length != 0} >
                <ChatSessionModal 
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />    
            </Modal>            
    </View>
    )
}

export default ChatCenter

const Bubble = ({value,setValue,activeValue,title}) => {
    return(
        <TouchableOpacity onPress={() => setValue(value)} style={activeValue == value ? AssistPanel_style.activeBubble : AssistPanel_style.disabledBubble}>
        <Text style={activeValue == value ? {fontWeight:"700"} : {fontWeight:"700",opacity:0.3}}>{title}</Text>
        </TouchableOpacity>
    )
}

const Bubble_NavBar = ({
    setActiveBubble,
    activeBubble
}) => {
    return(
        <View style={{width:"70%",flexDirection:"row",justifyContent:"space-between",marginTop:20,marginBottom:20}}>
        <Bubble 
            setValue={setActiveBubble}
            value={"assist"}
            title={"Assistants"}
            activeValue={activeBubble}
        />

        <Bubble 
            setValue={setActiveBubble}
            value={"ai"}
            title={"AI Doctors"}
            activeValue={activeBubble}
        />

    </View>
    )
}

const AssistantChatLogs = ({
    activeBubble,
    assistSessions,
    setSelectedChat
}) => {
    return(
        <>
        {activeBubble == "assist" &&
            <View style={{width:"100%",alignItems:"center"}}>
                
                {assistSessions.length != 0 ?
                    assistSessions.map((data,index) => (
                        <SessionBar 
                            data={data}
                            index={index}
                            key={index}
                            setSelectedChat={setSelectedChat}
                        />
                    ))
                    :
                    <View style={{width:"80%",padding:20,alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:20,marginVertical:50}}>
                        <Text style={{fontWeight:"700",fontSize:17,opacity:0.5}}>No chat started yet</Text>
                    </View>
                }
            </View>
        }
        </>
    )
}

const AiChatLogs = ({
    activeBubble,
    AI_Doctors_Data
}) => {
    return(
        <>
            {activeBubble == "ai" &&
                AI_Doctors_Data.map((data,index) => (
                    <ChatBotBar 
                        data={data}
                        index={index}
                        key={index}
                    />
                ))
            }
        </>
    )
}


