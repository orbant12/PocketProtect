import { SessionType } from "@/utils/types";
import { SlBubble, SlMagnifier, SlMagnifierAdd,SlClose,SlCheck, SlCamera, SlPaperPlane } from "react-icons/sl";


export const ChatModal = ({
    visible,
    setIsChatOpen,
    currentuser,
    sessionData,
    chatLog,
    setInputValue,
    inputValue,
    handleSubmit,
    scrollableDivRef
}:
{
    visible:boolean;
    setIsChatOpen:(visible:boolean) => void;
    currentuser:any;
    sessionData:SessionType | null;
    chatLog:any[];
    setInputValue:(inputValue:string) => void;
    inputValue:string;
    handleSubmit:() => void;
    scrollableDivRef:any;

}) => {
    return(
        <>
        {!visible ? 
            <div onClick={() => setIsChatOpen(!visible)} style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",background:"black",padding:15,borderRadius:100,position:"fixed",bottom:20,right:20,boxShadow:"0px 1px 10px 1px black",cursor:"pointer"}}>
                <SlBubble color='white' size={25} />
            </div>
            :
            <ChatSheet
                handleClose={() => setIsChatOpen(!visible)}
                me={currentuser != null ? currentuser.uid : ""}
                end={sessionData != null ? sessionData.clientData.id : ""}
                chatLog={chatLog} 
                profileUrl=''
                setInputValue={setInputValue}
                inputValue={inputValue}
                handleSubmit={handleSubmit}
                scrollableDivRef={scrollableDivRef}
            />
        }
        </>
    )
}

export const ChatSheet = ({
    handleClose,
    me,
    end,
    profileUrl,
    chatLog,
    setInputValue,
    inputValue,
    handleSubmit,
    scrollableDivRef
}:{
    handleClose: () => void;
    me:string,
    end:string,
    profileUrl:string,
    chatLog: any[],
    setInputValue: (inputValue:string) => void;
    inputValue:string;
    handleSubmit:() => void;
    scrollableDivRef: any;
}) => {

    return(
        <div style={{height:"100%",width:"100%",backgroundColor:"rgba(0,0,0,0.9)",position:"fixed",zIndex:100,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                    <div style={{width:"70%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:10,backgroundColor:"black",position:"absolute",zIndex:100,marginRight:180,top:10,borderTopRightRadius:30,borderTopLeftRadius:30}}>
                    <h5 style={{color:"white"}}>Chat</h5>
                    <SlClose color='red' size={25} style={{position:"absolute",right:10,cursor:"pointer"}} onClick={() => handleClose()} />
                    </div>
            <div ref={scrollableDivRef} style={{height:"80%",width:"70%",background:"white",borderRadius:10,position:"absolute",marginRight:180,marginBottom:100}}>
                <div    style={{display: "flex", flexDirection: "column",overflow:"hidden" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center",overflow:"hidden"}}>
                        {
                            chatLog.map((message,index) => (
                                <ChatMessage 
                                    message={message}
                                    key={index} 
                                    me={me != undefined ? me : ""} 
                                    end={end} 
                                    isLast={index === chatLog.length - 1} 
                                    profileUrl={profileUrl}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
            <ChatInput 
                setInputValue={setInputValue}
                inputValue={inputValue}
                handleSubmit={handleSubmit}
            />
        </div>
    )
}


const ChatMessage = ({ message, me, end, isLast,profileUrl }:{message:{user:string,inline_answer:boolean,sent:boolean,message:string},me:string,end:string,isLast:boolean,profileUrl:string}) => {
    return(
    <div  
    style={{
        display:"flex",
        flexDirection: "row",
        width: "60%",
        borderWidth: 0,
        alignSelf:message.user == me ? "end" : "start",
        padding: 10,
        paddingTop: 1,
        paddingBottom: 1,
        overflowY:"hidden",
        ...(message.user === me && { backgroundColor: "rgba(0,0,0,0)", flexDirection: "row-reverse",alignSelf:"end" }),
        ...(!message.inline_answer && message.sent && { marginTop: 30 }),
        ...(isLast && message.user === me && { marginBottom: 20 })
    }}
        >
        {message.user == end &&
            (
            !message.inline_answer ?
            <img
                src={profileUrl}
                style={{width:50,height:50,borderRadius:10,marginRight:5,overflowY:"hidden"}}
            />
            :
            <div style={{width:55}} />
            )
        }
        {message.user == end ? (
            <div style={{
                alignItems:"start",
                paddingTop:8,
                paddingBottom:8,                
                paddingRight:10,
                paddingLeft:10,
                backgroundColor:"rgba(0,0,255,0.4)",
                borderRadius:10,
                borderTopLeftRadius:0,
                borderBottomLeftRadius:2,
                marginBottom:0,
                ...(isLast && { marginBottom: 10 })
            }}>
                <p style={{
                    maxWidth:290,
                    color:"black",
                    fontWeight:"500"
                }}>
                    {message.message}
                </p>
            </div>
        ):(
            
            <div style={{
                alignItems:"start",
                padding:"8px 10px", 
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                backgroundColor:"rgba(0,0,255,0.2)",
                borderRadius:10,
                borderTopRightRadius:0,
                borderBottomRightRadius:2,
                marginBottom:0,
                ...(isLast && {marginBottom:10})
                }}>
                <p style={{
                    maxWidth:290,
                    color:"black",
                    fontWeight:"500"
                    }}>
                    {message.message}
                </p>
            </div>
        )
        }
        {message.sent ? (
            isLast && message.user == me ? (
            <div style={{flexDirection:"row",alignItems:"center",position:"absolute",bottom:-3,right:10}}>
                <SlCheck 

                    size={13}
                />
            </div>
        
            ): null
        ):(
            <div style={{flexDirection:"row",alignItems:"center",position:"absolute",bottom:-10,right:15}}>
                <div style={{borderColor:"blue",borderWidth:1,borderRadius:100,height:10,width:10}} />
                <p style={{fontSize:9,opacity:0.5}}> Sending ...</p>
            </div>
        )
        }
    </div>
    )
    };
    

const ChatInput = ({setInputValue,inputValue,handleSubmit}:{setInputValue:(inputValue:string) => void;inputValue:string;handleSubmit:() => void;}) => {
    return(
        <div style={{width:"70%",padding:"5px 20px",backgroundColor:"rgba(255,255,255,0.9)",position:"absolute",bottom:20,marginRight:180,borderRadius:5,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{padding:10,backgroundColor:"blue",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:40,borderRadius:100}}>
                <SlCamera color='white' />
            </div>
            <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} draggable={false}  style={{width:"80%",marginRight:10,marginLeft:10,padding:5,minHeight:50,maxHeight:90,maxWidth:"80%",minWidth:"60%",height:60,borderWidth:1,padding:"10px",borderRadius:5}} />
            <h6 style={{position:"absolute",right:"16%",bottom:10,fontSize:8,opacity:0.4}}>You can adjust the height here-></h6>
            <div onClick={handleSubmit} style={{padding:10,backgroundColor:"blue",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:100,borderRadius:100,minWidth:50}}>
                <SlPaperPlane color='white' />
            </div>
        </div>
    )
}