import { SelectableBars } from "../../../../components/Common/SelectableComponents/selectableBars";

export function Methods({
    setMethodSelected,
    methodSelected
}:{
    setMethodSelected:(type:string) => void;
    methodSelected: string;
}){
    return(
        <SelectableBars 
            setOptionValue={setMethodSelected}
            optionValue={methodSelected}
            items={[
                {type:"gallery", icon:{type:"icon",metaData:{name:"image",size:30}}, title:"Upload from gallery"},
                {type:"manual", icon:{type:"icon",metaData:{name:"fingerprint",size:30}}, title:"Add in manually"},
                {type:"pdf", icon:{type:"icon",metaData:{name:"file-upload",size:30}}, title:"Upload from PDF"},
                {type:"scan", icon:{type:"icon",metaData:{name:"data-matrix-scan",size:30}}, title:"Scan with your camera"}
            ]}
        />
    )
}