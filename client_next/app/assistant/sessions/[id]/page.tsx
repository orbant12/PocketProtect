"use client"

import {useParams,useRouter} from 'next/navigation'
import "../../assistant.css"
import { useState,useRef, useEffect } from 'react';
import { useAuth } from '@/Context/UserAuthContext';
import { fetchSession_Single,fetchChat,realTimeUpdateChat, fetchSessionSingleOrder, updateInspectMole_Results, uploadAnalasisResults } from '@/services/api';
import { messageStateChange } from '@/utils/assist/messageStateChanger';
import { SessionType, SpotData } from '@/utils/types';
import { MoleInspectionPanel } from './components/moleInspection';
import { ChatModal } from './components/chat';
import { OrdersPanel } from './components/oredersPanel';
import ReactPDF from '@react-pdf/renderer';
import { RequestTableType } from './components/table';
import { Answers, ReportWriting } from './components/moleReportWriting';
import { MyDocument } from './components/pdfModal';
import { Mole_Order_Finish_Provider, MoleAnalasis_Session_Finish_Provider } from './stateManager';
import { pdf } from '@react-pdf/renderer';


type ChatLogType = {
    user:string,
    message:string,
    sent:boolean,
    date: Date
    inline_answer:boolean
}

export interface Answer {
    answer: string;
    description: string;
}

export interface Result {
    answer: 0 | 1 | 2 | 3 | 4 | 5;
    description: string;
}

export interface MoleAnswers {
    asymmetry: Answer;
    border: Answer;
    color: Answer;
    diameter: Answer;
    evolution: Answer;
    id:string;
}

export interface ResultAnswers {
    mole_malignant_chance: Result;
    mole_evolution_chance: Result;
    mole_advice: string;
    id:string;
}

export interface OverallResultAnswers {
    chance_of_cancer:Result;
}



export default function SessionPage(){
    const router = useRouter();
    const { id } = useParams()
    const { currentuser } = useAuth()
    const [ selectedStage, setSelectedStage ] = useState(0)
    const [ isChatOpen, setIsChatOpen] = useState(false)
    const [ sessionData, setSessionData] = useState<SessionType | null>(null)
    const [ chatLog, setChatLog] = useState<ChatLogType[]>([])
    const [ inputValue, setInputValue] = useState("")
    const scrollableDivRef = useRef<HTMLDivElement>(null);
    const [ orders, setOrders ] = useState<RequestTableType[]>([])
    const [ selectedOrderForReview , setSelectedOrderForReview ] = useState<SpotData | null>(null)
    const [isChangeMade, setIsChangeMade] = useState(false);
    const [isOrderReady, setIsOrderReady] = useState(false);
    const [answerSheetForMoles, setAnswerSheetForMoles] = useState<Record<string, MoleAnswers>>({});
    const [resultSheetForMoles, setResultSheetForMole] = useState<Record<string, ResultAnswers>>({});
    const [ overallResultSheerForMoles, setOverallResultSheetForMoles ] = useState<OverallResultAnswers>({
        chance_of_cancer:{
            answer:0,
            description:""
        }
    })


    const fetchSessionChat = async (clientId:string) => {
        const response = await fetchChat({
            clientId:clientId,
            sessionId:String(id)
        })
        console.log(response)
        setChatLog(response) 
    }

    const updateChatLog = async (chatState: any[]) => {
        if ( currentuser && sessionData ) {
        const updatedChatState = await messageStateChange(chatState)
        const response = await realTimeUpdateChat({
            userId: sessionData.clientData.id,
            sessionId: String(id),
            chat: updatedChatState
        })
        console.log(response)
        return response
        }
    }

    const handleSubmit = async () => {
        if ( currentuser ) {
            const message = {user:`${currentuser.uid}`,message:inputValue,sent:false,date: new Date(),inline_answer: chatLog[chatLog.length -1 ].user == currentuser.uid};
            const chatState = [...chatLog,message]
            setChatLog(chatState)
            setInputValue("")
            try {
                const response = await updateChatLog(chatState);
                if (response === true) {
                    const updatedChatState = await messageStateChange(chatState)
                    setChatLog(updatedChatState);
                    scrollToBottom()
                } else {
                    console.error('Failed to update chat log');
                }
            } catch (error) {
                console.error('Error updating chat log:', error);
            }
        }
    }

    const scrollToBottom = () => {
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
        }
    };

    //WEB SOCKET
    useEffect(() => {
        if( sessionData ){
            fetchSessionChat(sessionData.clientData.id);
        }

        if( sessionData ){
            // Set up interval to fetch data every 5 seconds
            const intervalId = setInterval(() => fetchSessionChat(sessionData.clientData.id), 4000);
            return () => clearInterval(intervalId);
        }
    }, [sessionData])

    useEffect(() => {
        scrollToBottom()
    }, [isChatOpen]);


    // <=== Report Functions For Global Save ====>

    const fetchReport = async (sessionData:SessionType) => {
        if( currentuser ){ 
        const response = await fetchSessionSingleOrder({ 
            sessionId: String(sessionData.id),
            userId : currentuser.uid
        })
        if (response != null) { 
            setAnswerSheetForMoles(response.inspect)
            setResultSheetForMole(response.results)
        }
        return response
    }
    }

    const fetchSession = async() => {
        if( currentuser ){
        const response = await fetchSession_Single({ 
            sessionId:String(id),
            userId : currentuser.uid
        })
        if (response != null) {
            setSessionData(response)

            const res = await fetchReport(response)
            fetchSessionChat(response.clientData.id)
            if( res != null){
                const data_preprocess = response.purchase.item.map((item:SpotData,index:number) => {
                    return {
                        id: index,
                        melanomaId: item.melanomaId,
                        location:  item.melanomaDoc.spot.slug,
                        ai_risk: `${item.risk != null ? item.risk + ' Chance' : "Not analised" }`,
                        finished: Mole_Order_Finish_Provider({answer:res.inspect,data:item,results:res?.results}),
                        moleImage: item.melanomaPictureUrl,
                        open:() => 
                            <div onClick={() =>  {setSelectedOrderForReview(item);setSelectedStage(1)}} style={{width:200,height:40,padding:10,borderRadius:10,background:"black",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",alignSelf:"flex-end",marginLeft:0}}>
                                <h5 style={{color:"white"}}>Start Diagnosis</h5>
                            </div>
                        
                    }
                })
                setOrders(data_preprocess)
                await finishStateManager(data_preprocess)
            }
        }
    }
    }

    const handleSaveDocument = async () => {
        if ( selectedOrderForReview && sessionData && answerSheetForMoles && resultSheetForMoles && overallResultSheerForMoles && currentuser) {
            const response = await updateInspectMole_Results({
                userId:currentuser?.uid,
                sessionId:sessionData?.id,
                moleId:selectedOrderForReview?.melanomaId,
                inspectData:answerSheetForMoles[selectedOrderForReview?.melanomaId],
                resultData:resultSheetForMoles[selectedOrderForReview?.melanomaId]
            })
            if ( response != false ) {
                setIsChangeMade(false)
            } else {
                alert("Failed to save the document")
            }
        }
    }
    
    const finishStateManager = async (orders:any[]) => {
        const allMoleState = orders.map((order) => order.finished != undefined && order.finished)
        const response = MoleAnalasis_Session_Finish_Provider({overallResults:overallResultSheerForMoles,allMoleState:allMoleState})
        setIsOrderReady(!response)
    }

    const handleFinish = async (e:boolean) => {
        if (e == true && currentuser && sessionData ) {

            const createPDF_Blob = async () => {
                if (selectedOrderForReview) {
                // Generate PDF in memory
                const doc = (
                    <MyDocument
                        data={selectedOrderForReview}
                        sessionData={sessionData}
                        analasisData={answerSheetForMoles}
                        results={resultSheetForMoles}
                    />
                );

                const pdfInstance = pdf(doc);
                const asBlob = await pdfInstance.toBlob();
                return asBlob;
                }
            };
            const response = await uploadAnalasisResults({
                sessionData: sessionData,
                inspectData: answerSheetForMoles,
                resultData: resultSheetForMoles,
                overallResults: overallResultSheerForMoles,
                pdfBlob: await createPDF_Blob(),
            })
            if(response == true){
                alert("Session has been closed. Thank you for your work !")
                router.back()
            }
        }
    }

    useEffect(() => {
        if (isChangeMade == false) {
            setIsChangeMade(true)
        } 
    },[answerSheetForMoles,resultSheetForMoles,overallResultSheerForMoles])


    const loadPage = async () => {
        await fetchSession()
    }

    useEffect(() => {
        loadPage()
        scrollToBottom()
    },[])
    useEffect(() => {
        loadPage()
        scrollToBottom()
    },[currentuser])

    return(
        <div style={{width:"100%",flexDirection:"column",padding:0,display:"flex",minHeight:"130%"}}>
            <div style={{display:"flex",flexDirection:"column",width:"100%",padding:10,background:"rgba(0,0,0,1)",zIndex:9,position:"fixed",justifyContent:"center"}}>
            <div style={{display:"flex",flexDirection:"row",alignItems:"center",backgroundColor:"white",justifyContent:"space-between",padding:0,borderRadius:100,margin:10,zIndex:10,width:"50%",boxShadow:"revert 0px 0px 10px 0px black"}}>
                <Bubble 
                    title='Orders'
                    selectedStage={selectedStage}
                    setSelectedStage={setSelectedStage}
                    index={0}
                />
                <Bubble 
                    title='Mole Inspection'
                    selectedStage={selectedStage}
                    setSelectedStage={(e) => selectedOrderForReview ? setSelectedStage(e) : alert("You need to select an order first !")}
                    index={1}
                />
                <Bubble 
                    title='Report Creation'
                    selectedStage={selectedStage}
                    setSelectedStage={(e) => selectedOrderForReview ? setSelectedStage(e) : alert("You need to select an order first !")}
                    index={2}
                />
            </div>
            </div>
            {selectedStage == 0 && 
            <OrdersPanel 
                orders={orders}
                isOrderReady={isOrderReady} 
                finishStateManager={loadPage} 
                handleFinish={(e) => handleFinish(e)}
            />}
            {selectedStage == 1 &&  
            <MoleInspectionPanel 
                selectedOrderForReview={selectedOrderForReview} 
                sessionData={sessionData} 
                handleSaveDocument={handleSaveDocument}
                isChangeMade={isChangeMade}
            />}            
            {selectedStage == 2 &&  
            <ReportWriting 
                selectedOrderForReview={selectedOrderForReview} 
                sessionData={sessionData} 
                isChangeMade={isChangeMade}
                answerSheetForMoles={answerSheetForMoles}
                resultSheetForMoles={resultSheetForMoles}
                overallResultSheerForMoles={overallResultSheerForMoles}
                setOverallResultSheetForMoles={setOverallResultSheetForMoles}
                setAnswerSheetForMoles={setAnswerSheetForMoles}
                setResultSheetForMole={setResultSheetForMole}
                handleSaveDocument={handleSaveDocument}
            />}      
            <ChatModal 
                visible={isChatOpen}
                sessionData={sessionData}
                chatLog={chatLog}
                setInputValue={setInputValue}
                inputValue={inputValue}
                handleSubmit={handleSubmit}
                setIsChatOpen={setIsChatOpen}
                currentuser={currentuser}
                scrollableDivRef={scrollableDivRef}
            />
        </div>
    )
}

const Bubble = ({title, selectedStage, index, setSelectedStage}:{title:string; selectedStage:number; index:number; setSelectedStage:(selectedStage:number) => void}) => {
    return(
        <div onClick={() => setSelectedStage(index)} className={selectedStage == index ? 'bubble active' : 'bubble'} >
            <h4>{title}</h4>
        </div>
    )
}



function DataBar(){
    return(
        <div style={{width:200,padding:10,flexDirection:"row",display:"flex",border:"1px solid black"}}>
            <img src="" alt="mole" style={{width:70,height:70, border:"1px solid black"}} />
            <h4>Mole ID</h4>
            <h5>AI analised risk: 0.6</h5>
            <h5>Body part: 0.6</h5>
        </div>
    )
}

