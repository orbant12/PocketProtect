import React, { useEffect, useRef, useState } from 'react';
import imageKep from "../../../../../public/ISIC_0477738.jpg"
import {SlMagnifier, SlMagnifierAdd } from "react-icons/sl";
import { useMouseOverZoom } from "../hook"
import { SessionType, SpotData } from '@/utils/types';
import { fetchMoleHistory } from '@/services/api';
import { timestamp_DaysAgo_Calculator, timestampBirtDate_Age_Calculator_FromToday, timestampToString } from '@/utils/date_functions';


export const MoleInspectionPanel = ({
    selectedOrderForReview,
    sessionData,
    isChangeMade,
    handleSaveDocument
}:{
    selectedOrderForReview:SpotData | null;
    sessionData:SessionType | null;
    isChangeMade:boolean;
    handleSaveDocument:() => void;
}) => {

    const [ selectedMole , setSelectedMole ] = useState<string | undefined>(selectedOrderForReview?.melanomaPictureUrl)
    const [ selectedMoleHistory , setSelectedMoleHistory ] = useState<SpotData[]>([])


    const fetchOlderMoles = async () => {
        if (selectedOrderForReview && sessionData){
        const response = await fetchMoleHistory({
            moleId: selectedOrderForReview.melanomaId,
            userId: sessionData.clientData.id
        })
        if (response) {
            setSelectedMoleHistory(response)
        }
    }
    }

    useEffect(() => {
        fetchOlderMoles()
    },[selectedOrderForReview])

    return(
        <>
        {selectedOrderForReview ?
        <>
            {!isChangeMade ?
                <div className="finishButton" style={{position:"fixed",opacity:1,top:30,bottom:"auto",right:20,zIndex:10}} >
                    <h4 style={{color:"black",fontWeight:"800"}}>Saved</h4>
                </div>
                :
                <div onClick={handleSaveDocument} className="finishButton" style={{position:"fixed",background:"#FF7F7F",boxShadow:"0px 0px 0px 2px red",opacity:1,top:30,bottom:"auto",right:20,zIndex:10}} >
                    <h4 style={{color:"black",fontWeight:"800"}}>Click To Save</h4>
                </div>
            }
        <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",marginTop:170}}>
            <h1>Inspect • <span style={{opacity:0.4}}>{selectedOrderForReview.melanomaId}</span></h1>
            <h4 style={{padding:15, background:"rgba(0,255,0,0.3)",borderRadius:10,fontWeight:"500",opacity:0.7,fontSize:14,marginTop:10,maxWidth:"80%"}}>
                Analyse mole {selectedOrderForReview.melanomaId} with useful tools like zooming and access to older images of the mole for the inspection of evolution!
            </h4>
            <InspectionComponent 
                data={selectedMole}
            />
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginTop:20,width:"90%"}}>
                <h2 style={{alignSelf:"flex-start",margin:20}}>Older Images</h2>
                        <div style={ selectedMole == selectedOrderForReview.melanomaPictureUrl ? {display:"flex",flexDirection:"row",width:"80%",padding:15,justifyContent:"space-between",alignItems:"center",background:"black",border:"3px solid magenta",borderRadius:10,marginTop:20,marginBottom:20} : {display:"flex",flexDirection:"row",width:"80%",border:"3px solid black",padding:15,justifyContent:"space-between",alignItems:"center",background:"white",borderRadius:10,marginTop:20,marginBottom:20}}>
                            <img src={selectedOrderForReview.melanomaPictureUrl} alt="" style={{width:150,height:150,borderRadius:10}} />
                            {selectedMole != selectedOrderForReview.melanomaPictureUrl ?
                                <>
                                    <div style={{marginLeft:0}}>
                                    <h2>{timestampToString(selectedOrderForReview.created_at)}</h2>
                                    <h4 style={{fontWeight:"400",color:"rgba(0,0,0,0.6)"}}>Taken <span style={{fontWeight:"700",opacity:1,color:"black"}}>{timestamp_DaysAgo_Calculator(selectedOrderForReview.created_at)} days</span> ago</h4>
                                    </div>
                                    <div style={{marginRight:50}}>
                                        <h2>Information</h2>
                                        <h4>Bleeding: ?</h4>
                                        <h4>Itching: ?</h4>
                                    </div>
                                </>
                                :
                                <>
                                    <div style={{marginLeft:0}}>
                                    <h2 style={{color:"white"}}>{timestampToString(selectedOrderForReview.created_at)}</h2>
                                    <h4 style={{fontWeight:"400",color:"lightgray"}}>Taken <span style={{fontWeight:"700",opacity:1,color:"white"}}>{timestamp_DaysAgo_Calculator(selectedOrderForReview.created_at)} days</span> ago</h4>
                                    </div>
                                    <div style={{marginRight:50,color:"rgba(255,255,255,0.6)"}}>
                                        <h2>Information</h2>
                                        <h4>Bleeding: <span style={{color:"white"}}>?</span></h4>
                                        <h4>Itching: <span style={{color:"white"}}>?</span></h4>
                                    </div>
                                </>
                            }
                            {selectedMole != selectedOrderForReview.melanomaPictureUrl ?
                            <div onClick={() => setSelectedMole(selectedOrderForReview.melanomaPictureUrl)} style={{display:"flex",flexDirection:"column",background:"black",width:150,height:50,padding:10,alignItems:"center",justifyContent:"center",borderRadius:10,cursor:"pointer"}}>
                                 <h3 style={{color:"white"}}>Show</h3>
                            </div>    
                            :
                            <div onClick={() => setSelectedMole(selectedOrderForReview.melanomaPictureUrl)} style={{display:"flex",flexDirection:"column",background:"white",width:150,height:50,padding:10,alignItems:"center",justifyContent:"center",borderRadius:10,cursor:"pointer"}}>
                                 <h3 style={{color:"black"}}>Active</h3> 
                            </div>   
                            }
                            <h4 style={{position:"absolute",marginBottom:205,color:"magenta"}}>Most Recent ...</h4>
                        </div>
                {selectedMoleHistory.length > 0 &&
                    selectedMoleHistory.map((mole, index) => (
                        <div key={index} style={ selectedMole == mole.melanomaPictureUrl ? {display:"flex",flexDirection:"row",width:"80%",padding:15,justifyContent:"space-between",alignItems:"center",background:"black",border:"3px solid magenta",borderRadius:10,marginTop:20,marginBottom:20} : {display:"flex",flexDirection:"row",width:"80%",border:"3px solid black",padding:15,justifyContent:"space-between",alignItems:"center",background:"white",borderRadius:10,marginTop:20,marginBottom:20}}>
                            <img src={mole.melanomaPictureUrl} alt="" style={{width:150,height:150,borderRadius:10}} />
                            {selectedMole != mole.melanomaPictureUrl ?
                                <>
                                    <div style={{marginLeft:0}}>
                                    <h2>{timestampToString(mole.created_at)}</h2>
                                    <h4 style={{fontWeight:"400",color:"rgba(0,0,0,0.6)"}}>Taken <span style={{fontWeight:"700",opacity:1,color:"black"}}>{timestamp_DaysAgo_Calculator(mole.created_at)} days</span> ago</h4>
                                    </div>
                                    <div style={{marginRight:50}}>
                                        <h2>Information</h2>
                                        <h4>Bleeding: ?</h4>
                                        <h4>Itching: ?</h4>
                                    </div>
                                </>
                                :
                                <>
                                    <div style={{marginLeft:0}}>
                                    <h2 style={{color:"white"}}>{timestampToString(mole.created_at)}</h2>
                                    <h4 style={{fontWeight:"400",color:"lightgray"}}>Taken <span style={{fontWeight:"700",opacity:1,color:"white"}}>{timestamp_DaysAgo_Calculator(mole.created_at)} days</span> ago</h4>
                                    </div>
                                    <div style={{marginRight:50,color:"rgba(255,255,255,0.6)"}}>
                                        <h2>Information</h2>
                                        <h4>Bleeding: <span style={{color:"white"}}>?</span></h4>
                                        <h4>Itching: <span style={{color:"white"}}>?</span></h4>
                                    </div>
                                </>
                            }
                            {selectedMole != mole.melanomaPictureUrl ?
                            <div onClick={() => setSelectedMole(mole.melanomaPictureUrl)} style={{display:"flex",flexDirection:"column",background:"black",width:150,height:50,padding:10,alignItems:"center",justifyContent:"center",borderRadius:10,cursor:"pointer"}}>
                                 <h3 style={{color:"white"}}>Show</h3>
                            </div>    
                            :
                            <div onClick={() => setSelectedMole(mole.melanomaPictureUrl)} style={{display:"flex",flexDirection:"column",background:"white",width:150,height:50,padding:10,alignItems:"center",justifyContent:"center",borderRadius:10,cursor:"pointer"}}>
                                 <h3 style={{color:"black"}}>Active</h3> 
                            </div>   
                            }
                        </div>
                    )) 
                }
            </div>
        </div>
        </>
        :
        <div style={{width:"100%",height:"100%",flexDirection:"column",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <h4>You need to select an order first !</h4>
        </div>
        }
        </>
    )
}


const InspectionComponent = ({
    data
}:{
    data:string | undefined
}) => {

    const source = useRef<HTMLImageElement>(null); 
    const target = useRef<HTMLCanvasElement>(null); 
    const cursor = useRef<HTMLDivElement>(null); 
    const [ activeZoom, setActiveZoom ] = useState("")

    const zoom = activeZoom == "1x" ? 100 : 20
    
    useMouseOverZoom(source, target, cursor, zoom);

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });


    const handleMouseDown = (e: any) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e: any) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return(
        <div style={{display:"flex",flexDirection:"column",width:"100%",marginTop:10,alignItems:"center"}}>
        <div style={{display:"flex",flexDirection:"row",width:"100%",alignItems:"center",justifyContent:"space-between",padding:30}}>
        </div>
            <div className='editor-stage'>
            {activeZoom != "" &&
                <div className='zoomerBox'
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp} // Ensure it stops dragging if the mouse leaves the box
                    style={{ left: `${position.x}px`, top: `${position.y}px` }}
                >
                    <div style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",display:"flex"}}>
                    <h4>{activeZoom} Zoom</h4>
                    <h6 style={{opacity:0.3}}>You can move this by grabbing !</h6>
                    </div>
                    <canvas ref={target} className="element" />
                </div>
            }
            <ImageEditor 
                activeZoom={activeZoom}
                source={source}
                setActiveZoom={setActiveZoom}
                cursor={cursor}
                data={data}
            />
            </div>
        </div>
    )
}

function ImageEditor({
    activeZoom,
    source,
    setActiveZoom,
    cursor,
    data
}:{
    activeZoom: "" | "1x" | "2x" | string;
    source: any,
    setActiveZoom: (activeZoom:"" | "1x" | "2x") => void;
    cursor:any;
    data:string | undefined;
}) {
    return(
        <div className='image-editor'>
            <img src={data} className='image-edit' width={500} ref={source} style={{width:"500px", height:"500px", border:"1px solid black"}} />
            {/* <div ref={cursor} className="cursor-element" /> */}
            
            <div style={{width:80,display:"flex",flexDirection:"column",background:"black",padding:20,height:500, borderTopRightRadius:30,borderBottomRightRadius:30,alignItems:"center"}}>
                <div onClick={() => activeZoom == "1x" ? setActiveZoom("") : setActiveZoom("1x")} className='tool-btn' style={activeZoom == "1x" ? {backgroundColor:"rgb(255, 148, 243)"}:{}}>
                    <SlMagnifier color='black' size={20} />    
                </div>
                <div onClick={() => activeZoom == "2x" ? setActiveZoom("") : setActiveZoom("2x")} className='tool-btn' style={activeZoom == "2x" ? {backgroundColor:"rgb(255, 148, 243)"}:{}}>
                    <SlMagnifierAdd color='black' size={20} />    
                </div>
            </div>
        </div>
    )
}
