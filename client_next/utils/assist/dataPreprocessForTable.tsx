import { RequestTableType } from "@/app/assistant/sessions/[id]/components/table";
import { SessionType } from "../types"


export const DataPreprocessForTable = ({setSelectedOrderForReview,data}:{data: any;setSelectedOrderForReview:(item:any) => void}) => {
    const data_preprocess : RequestTableType = data.map((item:SessionType,index:number) => {
        return {
            id: index,
            session_id: item.id,
            date:  "item.created_at",
            order: `${item.purchase.item.length} Mole Check`,
            data: item.purchase.item,
            open:() => 
                <div onClick={() => {setSelectedOrderForReview(item.purchase.item)}} style={{width:100,height:40,padding:10,borderRadius:10,background:"black",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",alignSelf:"flex-end",marginLeft:100}}>
                    <h5 style={{color:"white"}}>See Moles</h5>
                </div>
            
        }
    })
    return data_preprocess
}