"use client"

import { SlArrowRightCircle,SlBubble,SlEnvolopeLetter, SlCheck,SlClose,SlArrowLeftCircle } from "react-icons/sl";

import "../assistant.css"
import { useEffect,useState } from "react";
import { fetchSessions_All } from "@/services/api";
import Link from "next/link";
import { useAuth } from "@/Context/UserAuthContext";
import { useRouter } from "next/navigation";

type SessionType = {
    id: string;
    clientData: {
        id:string;
        profileUrl?: string;
        fullname: string;
    };
    sessionStage: {
        stage_1:{
            title:string;
            complete: boolean;
        }
        
    };
    item: { type:string, data: {} }
};


const SessionPanel = () => {

const [activeSessions, setActiveSessions] = useState<SessionType[]>([]);
const { currentuser } = useAuth()
const router = useRouter()


const fetchAllSessions = async () => {
    if(currentuser) {
        const response = await fetchSessions_All({
            userId: currentuser.uid
        })
        setActiveSessions(response)
        console.log(response)
    }
}


useEffect(() => {
    fetchAllSessions() 
},[currentuser])


const Mole_Check_Stages = [
    {
        stage:1,
        title:"Mole Image Review",
        complete: false
    }
]
    return(
        <div style={{display:"flex",flexDirection:"column",width:"100%",height:"100%"}}>
            
            <div style={{display:"flex",flexDirection:"row",padding:50,width:"100%",justifyContent:"space-between",alignItems:"center"}}>
                <h2>Your Active Sessions</h2>
                <BackIcon handleBack={() => router.back()} />
            </div>
            <div style={{display:"flex",flexDirection:"column",width:"100%",alignItems:"center"}}>
                {activeSessions.map((data) => (
                    <SessionBar props={data} />
                ))}                
            </div>
        </div>
    )
}

export default SessionPanel;


const SessionBar = ({props}:{props: SessionType}) => {
    return(
        <div style={{width:"60%",border:"2px solid black",padding:15,borderRadius:10,marginBottom:80,overflow:"hidden",minHeight:340,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",flexDirection:"row",width:"100%",justifyContent:"space-between"}}>
                <div style={{flexDirection:"row",display:"flex"}}>
                    <img src={props.clientData?.profileUrl} style={{height:60,width:60,borderWidth:"5px solid black",borderRadius:10}} />
                    <div style={{display:"flex",flexDirection:"column",marginLeft:10}}>
                        <h2>{props.clientData?.fullname}</h2>
                        <h5 style={{fontWeight:600,opacity:1}}><span style={{fontWeight:400,opacity:0.6}}>Accepted at:</span> 2003.11.17</h5>
                    </div>
                </div>
                <div>
                    <h3 style={{fontSize:15}}><span style={{fontWeight:500,opacity:0.8}}>Session stage:</span> Open</h3>
                    <h3 style={{textAlign:"right"}}>{props.id}</h3>
                </div>
                
            </div>
            <div style={{display:"flex",flexDirection:"column",width:"100%",marginTop:30,padding:10}}>                
                <h3 style={{fontSize:18}}><span style={{fontWeight:500,opacity:0.8}}>Item:</span> 3x Mole Check</h3>
                
            </div>
            <div style={{display:"flex",flexDirection:"row",width:"100%",marginTop:3,padding:10,flexWrap:"wrap",justifyContent:"center"}}> 
                <StageBox 
                    complete={true}
                    title="Mole Image Review"
                    stage={1}
                />
                <StageBox 
                    complete={false}
                    title="Mole Image Review"
                    stage={2}
                />
                <StageBox 
                    complete={false}
                    title="Mole Image Review"
                    stage={3}
                />
            </div>
            <Link className="openBtn" href={`/assistant/sessions/${props.id}`}>
                    <h4 style={{color:"white",fontWeight:"500"}}>Open</h4>
            </Link>
            
        </div>
    )
}

const StageBox = ({
    stage,
    title,
    complete
}:
{
    stage: number;
    title: string;
    complete: boolean;
}) => {
    return(
        <div style={{flexDirection:"column",alignItems:"center",justifyContent:"center",display:"flex",padding:10,boxShadow:"1px 1px 1px 1px black",margin:10}}>
        {complete ? <SlCheck color="lightgreen" style={{position:"absolute",alignSelf:"end",marginBottom:50}} /> : <SlClose color="red" style={{position:"absolute",alignSelf:"end",marginBottom:50}} />}
        <h4>Stage {stage}</h4>
        <h3>{title}</h3>
    </div>
    )
}


export function BackIcon ({handleBack}:{handleBack:() => void}){
    return(
        <div className="back_icon" onClick={handleBack}>
            <h5>Back</h5>
        </div>
    )
}