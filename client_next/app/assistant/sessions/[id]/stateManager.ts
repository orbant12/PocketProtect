import { SpotData } from "@/utils/types"
import { MoleAnswers, OverallResultAnswers, ResultAnswers } from "./page"


export const Mole_Order_Finish_Provider = ({ answer, data, results }: { answer: Record<string, MoleAnswers>, data: SpotData, results: Record<string, ResultAnswers> }) => {
    if(  answer?.[data.melanomaId] != undefined && results?.[data.melanomaId] != undefined){
    return (
        answer?.[data.melanomaId].asymmetry.answer !== "" &&
        answer?.[data.melanomaId].border.answer !== "" &&
        answer?.[data.melanomaId].color.answer !== "" &&
        answer?.[data.melanomaId].diameter.answer !== "" &&
        answer?.[data.melanomaId].evolution.answer !== "" &&
        results?.[data.melanomaId].mole_evolution_chance.answer !== 0 &&
        results?.[data.melanomaId].mole_advice !== ""
    );
    }
};


export const MoleAnalasis_Session_Finish_Provider = ({ overallResults,allMoleState }: {  overallResults:OverallResultAnswers;allMoleState:boolean[] }) => {
    return(
        overallResults?.chance_of_cancer.answer != 0 
        && allMoleState.every((state) => state)
    )
}


