

import EnhancedTable, { HeadCell, RequestTableType } from "../components/table"
import { useEffect } from "react";

export const OrdersPanel = ({orders,isOrderReady,finishStateManager,handleFinish}:{orders:RequestTableType[];isOrderReady:boolean;finishStateManager:() => void;handleFinish:(e:boolean) => void}) => {
 
  const headCells: readonly HeadCell[] = [
    {
        id: 'melanomaId',
        numeric: true,
        disablePadding: true,
        label: 'Mole ID',
    },
    {
      id: 'location',
      numeric: false,
      disablePadding: false,
      label: 'Location',
    },
    {
        id: 'ai_risk',
        numeric: false,
        disablePadding: false,
        label: 'AI Prediction',
    },
    {
      id: 'finished',
      numeric: false,
      disablePadding: false,
      label: 'State',
  },
  ];

  useEffect(() => {
    finishStateManager()
  },[])

    return(
        <div style={{marginTop:120}}>
          <EnhancedTable 
              rows={orders}
              handleAccept={() => console.log("Accepted")}
              headCells={headCells}
              type="mole"
              tableTitle='Orders'
              isOrderReady={isOrderReady}
              handleFinish={(e) => handleFinish(e)}
          />
        </div>
    )

}







