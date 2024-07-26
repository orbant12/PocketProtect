import { PromptResponseFormat } from "../pages/Chat/aiChatWelcome";
import { app } from "./firebase"
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions(app);


const  generateDiagnosisFromPrompt = async (request:string) => {
    const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
    try {
        const result = await generateTextFunction({name: request}) as PromptResponseFormat;             
        return `${result.data.data.choices[0].message.content}`
    } catch (error) {
        console.error('Firebase function invocation failed:', error);
        return error
    }
};  

const ProcessDiagnosisDescription= async (diagnosis) => {
    const type = "description"
    const prompt = `Can you make a short description about ${diagnosis}. Try to explain it under 50 words and as efficently as possible.`;
    const response = await generateDiagnosisFromPrompt(prompt)
    return {[type]: response}
}

const ProcessDiagnosisSymphtoms = async (diagnosis) => {
    const type = "symphtoms"
    const prompt = `Can list out all common symphtoms of ${diagnosis}. Be straight forward and you MUST only state the symphtoms by ascending numbered order.`;
    const response = await generateDiagnosisFromPrompt(prompt)
    const lines = response.split('\n');
    const formating = await lines.map(line => {
        const [numbering, content] = line.match(/^(\d+)\.\s(.*)$/).slice(1);
        return { numbering, content };
    });
    return {[type]: formating}
}

const ProcessDiagnosisRecovery= async (diagnosis) => {
    const type = "recovery"
    const prompt = `You are a doctor. I am your patient and I have ${diagnosis}. List out all of the professional medication used in medicine for recovering from ${diagnosis}. Be straight forward and you must only state your solutions by ascending numbered order.`;
    const response = await generateDiagnosisFromPrompt(prompt)
    const lines = response.split('\n');
    const formating = lines.map(line => {
        const [numbering, content] = line.match(/^(\d+)\.\s(.*)$/).slice(1);
        return { numbering, content };
    });
    return {[type]: formating}
}

const ProcessSingleDiagnosis = async ({
    possibleOutcomes,
    dataFixed
}) => {
    const type = "diagnosis"
    const sympthomsPrompt = `Possible causes: ${possibleOutcomes}`;
    const binaryFeedback = dataFixed.map(item => {
            return item.q + ", " + item.a + '\n';
    });        
    const prompt = `Recently I'v asked you to create a survey from which you can confidently decide which of these causes is the most likely. ${sympthomsPrompt}.This is the survey: ${binaryFeedback} . Please choose from the Possible Causes, your answer MUST only contain that one likely cause as a word.`;
    const response = await generateDiagnosisFromPrompt(prompt)
    return {[type]: response}
}

const ProcessRediagnosis = async ({dataFixed,possibleOutcomes,preDiagnosis}) => {
    const type = "diagnosis"
    const sympthomsPrompt = `Possible causes: ${possibleOutcomes}`;
    const binaryFeedback = dataFixed.map(item => {
            return item.q + ", " + item.a + '\n';
    });    
    const prompt = `Recently I'v asked you to create a survey from which you can confidently decide which of these causes is the most likely. ${sympthomsPrompt}.This is the survey: ${binaryFeedback} . Please choose from the Possible Causes, you cannot choose ${preDiagnosis}, your answer MUST only contain that one likely cause as a word.`;
    const response = await generateDiagnosisFromPrompt(prompt)
    return { [type]: response }
}

const ProcessCreateSurvey= async ({dataFixed,fullDiagnosis}) => {    
    const binaryFeedback = dataFixed.map(item => {
        return item.q + ", " + item.a + '\n';
    });
    const sympthomsPrompt = `Previous client answers: ${binaryFeedback}`;
    const diagnosisScript = `Diagnosis we want to determine wether probable or not: ${fullDiagnosis.diagnosis}`;    
    const prompt = `${sympthomsPrompt}.${diagnosisScript}. You are a doctor trying to evaluate the hypothesis that your patient has ${fullDiagnosis.diagnosis}. Create a survey with questions that is formed to actively test the possibility of this hipothesys and evaluate it's chance dont include questions that have been asked. Servey must only contain forms of these: yes or no (qid:binary), client feedback required (qid:feedback). Your answer must be only contain the survey and each question asked like this:
    binary,Have you ...? \n
    feedback,Please describe ... \n `;
    const response = await generateDiagnosisFromPrompt(prompt)

    const formattedData = response.split('\n').map(line => {
        const [type, question] = line.split(',');    
        return { type, q: question };
    });    

    const filtered = await formattedData.filter(item => item.q !== undefined);

    return filtered
}

const ProcessFutureAssistanceDiagnosis = async ({diagnosis,memoryDataFixed,dataFixed}) => {   
    const type = "periodic_assistance"
    const binaryFeedback = memoryDataFixed.map(item => {
        return item.q + ", " + item.a + '\n';
    });
    const binaryFeedback2 = dataFixed.map(item => {
        return item.q + ", " + item.a + '\n';
    });
    const sympthomsPrompt = `Previous client answers: Stage 1:${binaryFeedback}, Stage 2: ${binaryFeedback2}`;
    const diagnosisScript = `Diagnosis of the client: ${diagnosis}`;    
    const prompt = `${diagnosisScript}.${sympthomsPrompt}. If you could gather information from this patient what frequency of interogation sessions be valuable from a data gathering to medicate this patient stand point: DAILY or if < WEEKLY or if < EVERY X DAYS or if < MONTHLY is enough. Your answers MUST only be either "Daily" if you thing daily sessions recommended or "Weekly" if weekly enough or "Every x days" if its more then weekly but less then monthly or "Monthly" if monthly is enough !`;
    const response = await generateDiagnosisFromPrompt(prompt)
    return { [type]: response }
}

const ProcessHelpForDiagnosis = async (diagnosis) => {
    const type = "help"
    const prompt = `I have ${diagnosis}. Can you offer me help advice for solution like: lifestyle choices, medication extc. Be straight forward and you must focus only stating your advice and solutions`;
    const response = await generateDiagnosisFromPrompt(prompt)
    const lines = response.split('\n');
    const formating = lines.map(line => {
    const [numbering, content] = line.match(/^(\d+)\.\s(.*)$/).slice(1);
    return { numbering, content };
    });
    return { [type]: formating }
}

const ProcessYoutubeExplainVideo = async (diagnosis) => {   
    const type = "explain_video"   
    const prompt = `Can you please recommend the best youtube video that explains ${diagnosis}. Your answer MUST be ONLY the https:// link to the video`
    const response = await generateDiagnosisFromPrompt(prompt)
    return { [type]: response }
}

const ProcessChanceOfDiagnosis = async ({diagnosis,dataFixed,memoryDataFixed}) => {
    const type = "chance"
    const binaryFeedback = memoryDataFixed.map(item => {
        return item.q + ", " + item.a + '\n';
    });
    const binaryFeedback2 = dataFixed.map(item => {
        return item.q + ", " + item.a + '\n';
    });
    const sympthomsPrompt = `Previous client answers: Stage 1:${binaryFeedback}, Stage 2: ${binaryFeedback2}`;
    const diagnosisScript = `Diagnosis we want to evaluate the chance of: ${diagnosis}`;    
    const prompt = `You are a prediction device predicting chance of diases being present by client feed back. Your client has ${diagnosis}.${sympthomsPrompt}.${diagnosisScript}. Your answer MUST be a percentage only !`;
    const response = await generateDiagnosisFromPrompt(prompt)
    return { [type]: response }
}


export const getDiagnosisData = async ({
    stage,
    diagnosis,
    memoryDataFixed,
    dataFixed
}) => {
    try{
        if ( stage === 1 ){
            const description = await ProcessDiagnosisDescription(diagnosis)
            const symphtoms = await ProcessDiagnosisSymphtoms(diagnosis)  
            const recovery = await ProcessDiagnosisRecovery(diagnosis)                          
            let diagnosisData = [description, symphtoms, recovery]     
            return diagnosisData
        } else if ( stage === 2 ){
            const chance = await ProcessChanceOfDiagnosis({diagnosis,memoryDataFixed,dataFixed})
            const help = await ProcessHelpForDiagnosis(diagnosis)            
            const future_assistance = await ProcessFutureAssistanceDiagnosis({diagnosis,memoryDataFixed,dataFixed})    
            const description = await ProcessDiagnosisDescription(diagnosis)
            const symphtoms = await ProcessDiagnosisSymphtoms(diagnosis)  
            const recovery = await ProcessDiagnosisRecovery(diagnosis)   
            const video = await ProcessYoutubeExplainVideo(diagnosis)                       
            let diagnosisData = [description, symphtoms, recovery, help, future_assistance, video, chance ]     
            return diagnosisData
        }
    } catch(err) {
        return false
        console.log(err)
    }

}

export const getDiagnosis = async({
    possibleOutcomes,
    dataFixed
}) => {
    try{
        const diagnosis = await ProcessSingleDiagnosis({dataFixed,possibleOutcomes})
        return diagnosis.diagnosis
    } catch {
        return false
    }
}

export const getReDiagnosis = async ({
    possibleOutcomes,
    dataFixed,
    preDiagnosis
}) => {
    try{
        console.log(preDiagnosis)
        const rediagnosis = await ProcessRediagnosis({dataFixed,possibleOutcomes,preDiagnosis})
        return rediagnosis.diagnosis
    } catch {
        return false
    }
}

export const getSurvey = async ({
    dataFixed,
    fullDiagnosis
}) => {
    try{
        const survey = await ProcessCreateSurvey({dataFixed,fullDiagnosis})
        return survey
    } catch {

    }
}