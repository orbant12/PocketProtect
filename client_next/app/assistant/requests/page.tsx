"use client"

import { useAuth } from '@/Context/UserAuthContext';
import { fetchRequests, handleRequestAccept, setupDocumentsForAssistant } from '@/services/api';
import { Gender, SessionType, SkinType, Slug, SpotData } from "@/utils/types";
import * as React from 'react';
import EnhancedTable, { HeadCell } from '../sessions/[id]/components/table';
import { SlClose } from "react-icons/sl";


type RequestTableType = {
    id: number;
    session_id: string;
    date: string;
    order: string;
    open:() => React.ReactNode;
    finished?: boolean;
}

type OrderData = {
    id:string;
    location:Slug;
    image:string;
    gender:Gender;
    skin_type:SkinType;
    ai_risk:string | null;
}



const RequestPage = () => {

    const { currentuser } = useAuth()

    const [rows, setRows] = React.useState<RequestTableType[]>([])
    const [rawData, setRawData] = React.useState<SessionType[]>([])
    const [selectedOrderForReview, setSelectedOrderForReview] = React.useState<SpotData[] | null>(null)

    const headCells: readonly HeadCell[] = [
        {
            id: 'session_id',
            numeric: true,
            disablePadding: true,
            label: 'Session ID',
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: false,
            label: 'Requested at',
        },
        {
            id: 'order',
            numeric: false,
            disablePadding: false,
            label: 'Order',
        },
        {
          id: 'open',
          numeric: false,
          disablePadding: false,
          label: 'Open',
      },
    ];

    const fetchCurrentRequests = async () => {
        if (!currentuser) return
        const response: SessionType[] = await fetchRequests({
            userId: currentuser.uid
        })
        const data_preprocess = response.map((item:SessionType,index) => {
            return {
                id: index,
                session_id: item.id,
                date:  "item.created_at",
                order: `${item.purchase.item.length} Mole Check`,
                data: item.purchase.item,
                finished: false,
                open:() => 
                    <div onClick={() => {setSelectedOrderForReview(item.purchase.item)}} style={{width:100,height:40,padding:10,borderRadius:10,background:"black",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",alignSelf:"flex-end",marginLeft:100}}>
                        <h5 style={{color:"white"}}>See Moles</h5>
                    </div>
                
            }
        })
        setRawData(response)
        setRows([...data_preprocess])
    }

    const handleAccept = async (selectedArray:number[]) => {
        selectedArray.map((item) => {
            const sess = rawData[item]
            handleRequestAccept({
                sessionData: sess,
            })
        })
        fetchCurrentRequests()
    }

    React.useEffect(() => {
        fetchCurrentRequests()
    },[currentuser])



    return (
        <div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column"}}>
            <EnhancedTable 
                rows={rows}
                handleAccept={handleAccept}
                headCells={headCells}
                type='req'
                tableTitle='Your Order Requests'
                handleFinish={() => {}}
            />
            <Product_Showcase_Modal 
                visible={selectedOrderForReview != null}
                order_images={selectedOrderForReview != null ? selectedOrderForReview : []}
                setSelectedOrderForReview={setSelectedOrderForReview}
            />
        </div>
    )
}

export default RequestPage



const Product_Showcase_Modal = ({
    visible,
    order_images,
    setSelectedOrderForReview
}:{
    visible?:boolean;
    order_images?:SpotData[];
    setSelectedOrderForReview:(order:SpotData[] | null) => void;
}) => {
    return (
        <>
        {visible &&
        <div style={{position:"absolute",width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.8)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <div style={{width:"80%",margin:10,padding:10,background:"white",marginRight:100,alignItems:"center",borderRadius:10,overflowY:"scroll",display:"flex", flexDirection:"column",paddingTop:30}}>
                <SlClose onClick={() => setSelectedOrderForReview(null)} color='red' size={25} style={{alignSelf:"end",cursor:"pointer"}} />
                <h2 style={{color:"black",overflow:"visible",marginBottom:20}}>Client Order</h2>
                <h4 style={{color:"black",maxWidth:"80%",backgroundColor:"rgba(255,0,0,0.4)",padding:10,borderRadius:10,textAlign:"center",opacity:0.8,overflow:"visible"}}>Make sure to only accept the offer if you are 100% sure that the quality will not negatively impact your diagnosis.</h4>
                <div style={{marginTop:50,width:"100%",alignItems:"center",overflow:"visible",display:"flex",flexDirection:"column"}}>
                    {order_images?.map((image:SpotData,index) => {
                        return(
                            <>
                            <div style={{display:"flex",flexDirection:"column",marginBottom:50}}>
                                <h3>{image.melanomaId}</h3>
                                <img key={index} src={image.melanomaPictureUrl} title={"image.melanomaPictureUrl"} style={{width:300,height:300}} />
                            </div>
                        </>
                        )
                    })}
                </div>
            </div>
        </div>
        }
        </>
    )
}







