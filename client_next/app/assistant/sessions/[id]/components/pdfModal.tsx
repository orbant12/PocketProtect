import { SessionType, SpotData} from "@/utils/types"
import { SlClose } from "react-icons/sl";
import { Page, Text, View, Document, StyleSheet,Image } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { timestampToString } from "@/utils/date_functions";
import { MoleAnswers, ResultAnswers } from "../page";


export const PDF_Modal = (
    {
        setIsPDFVisible,
        isPDFVisible,
        selectedOrderForReview,
        sessionData,
        answers,
        results
    }:{
        isPDFVisible:boolean;
        setIsPDFVisible:(arg:boolean) => void;
        selectedOrderForReview:SpotData;
        sessionData:SessionType;
        answers: Record<string, MoleAnswers>;
        results: Record<string, ResultAnswers>;
    }) => {
    return(
            <div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",background:"rgba(0,0,0,0.8)",position:"fixed",marginTop:-135,zIndex:100}}>
                <PDFViewer style={{width:"100%",height:"100%"}}>
                    <MyDocument 
                        data={selectedOrderForReview}
                        sessionData={sessionData}
                        analasisData={answers}
                        results={results}
                    />
                </PDFViewer>
                <div onClick={() => setIsPDFVisible(!isPDFVisible)} style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",background:"white",padding:15,borderRadius:10,position:"fixed",bottom:30,right:20,boxShadow:"0px 1px 10px 1px black",cursor:"pointer"}}>
                    <h3 style={{marginRight:10}}>Close</h3>
                    <SlClose color='red' size={25} />
                </div>
            </div>
    )
}



const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#E4E4E4',
      padding:10
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    }
  });
  
  // Create Document Component
  export const MyDocument = ({
    data,
    sessionData,
    analasisData,
    results
  }:{
    data:SpotData,
    sessionData:SessionType,
    analasisData: Record<string, MoleAnswers>;
    results: Record<string, ResultAnswers>;
  }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{flexDirection:"column",width:"100%",alignItems:"center",marginTop:15}}>
            <Text style={{position:"absolute",left:15,fontSize:10}}>Pocket Protect</Text>
            <Text style={{fontWeight:"thin",fontSize:18,borderRadius:5,padding:5,color:"black"}}>Mole Analasis Report</Text>
        </View>
        <View style={{margin:10,marginLeft:20,marginTop:30}}>
            <Text style={{fontSize:20}}>Analasis Data</Text>
            <View style={{width:"80%",justifyContent:"space-between",margin:10,flexDirection:"row"}}>
                <View style={{paddingLeft:20,borderLeftWidth:2,marginTop:10}}>
                    <Text style={{fontSize:15,marginTop:2,fontWeight:"bold"}}>Patient</Text>
                    <Text style={{fontSize:8,marginTop:2}}>UID: {sessionData.clientData.id} </Text>
                    <Text style={{fontSize:12,marginTop:10}}>Name: {sessionData.clientData.fullname} </Text>
                    <Text style={{fontSize:12,marginTop:10,marginBottom:2}}>Birthdate: {timestampToString(sessionData.clientData.birth_date)} </Text>
                </View>

                <View style={{paddingLeft:20,borderLeftWidth:2,marginTop:10}}>
                    <Text style={{fontSize:15,marginTop:2,fontWeight:"bold"}}>Dermatologist</Text>                
                    <Text style={{fontSize:12,marginTop:10}}>Name: {sessionData.assistantData.fullname} </Text>
                    <Text style={{fontSize:12,marginTop:10,marginBottom:2}}>Profession: {sessionData.assistantData.field}</Text>
                </View>
            </View>
        </View>
        <View style={{margin:10,marginLeft:20}}>
        <Text style={{fontSize:20}}>Results</Text>
            {sessionData.purchase.item.map((data) => (
                <View style={{paddingLeft:20,borderLeftWidth:2,marginTop:10}}>
                    <Text style={{fontSize:15,marginTop:5}}>Mole: {data.melanomaId}</Text>
                    <View style={{width:"100%",flexDirection:"row",marginTop:20,borderBottomWidth:0.3,paddingBottom:20}}>
                        <Image source={data.melanomaPictureUrl} style={{width:50,height:50,borderWidth:1,borderRadius:5}} />
                        <View style={{width:"70%",margin:0,flexDirection:"column",marginLeft:20}}>
                            <Text style={{fontSize:10}}>• Location: {data.melanomaDoc.spot[0].slug}</Text>
                            <Text style={{fontSize:10,marginTop:7}}>• AI Risk Prediction: {data.risk == null ? "Not Analised" : data.risk}</Text>
                            <Text style={{fontSize:10,marginTop:7}}>• Photo taken: {timestampToString(data.created_at)}</Text>
                        </View>
                    </View>
                    <View style={{width:"100%",marginTop:10,borderBottomWidth:0.3,paddingBottom:20}}>
                        <Text style={{fontSize:15,marginTop:5,marginBottom:10}}>Analasis</Text>
                        <Text style={{fontSize:11,marginTop:5}}>• Asymmetry: {analasisData[data.melanomaId].asymmetry.answer}</Text>
                        {analasisData[data.melanomaId].asymmetry.description != "" && <Text style={{fontSize:9,marginTop:7,paddingLeft:8,borderLeftWidth:1,marginLeft:5}}>Description: {analasisData[data.melanomaId].asymmetry.description}</Text>}
                        <Text style={{fontSize:11,marginTop:15}}>• Border: {analasisData[data.melanomaId].border.answer}</Text>
                        {analasisData[data.melanomaId].border.description != "" && <Text style={{fontSize:9,marginTop:7,paddingLeft:8,borderLeftWidth:1,marginLeft:5}}>Description: {analasisData[data.melanomaId].border.description}</Text>}
                        <Text style={{fontSize:11,marginTop:15}}>• Color: {analasisData[data.melanomaId].color.answer}</Text>
                        {analasisData[data.melanomaId].color.description != "" && <Text style={{fontSize:9,marginTop:7,paddingLeft:8,borderLeftWidth:1,marginLeft:5}}>- Description: {analasisData[data.melanomaId].color.description}</Text>}
                        <Text style={{fontSize:11,marginTop:15}}>• Diameter: {analasisData[data.melanomaId].diameter.answer}</Text>
                        {analasisData[data.melanomaId].diameter.description != "" && <Text style={{fontSize:9,marginTop:7,paddingLeft:8,borderLeftWidth:1,marginLeft:5}}>- Description: {analasisData[data.melanomaId].diameter.description}</Text>}
                        <Text style={{fontSize:11,marginTop:15}}>• Evolution: {analasisData[data.melanomaId].evolution.answer}</Text>
                        {analasisData[data.melanomaId].evolution.description != "" && <Text style={{fontSize:9,marginTop:7,paddingLeft:8,borderLeftWidth:1,marginLeft:5}}>- Description: {analasisData[data.melanomaId].evolution.description}</Text>}
                    </View>
                    <View style={{width:"100%",marginTop:10,borderBottomWidth:2,paddingBottom:20}}>
                        <Text style={{fontSize:15,marginTop:5,marginBottom:10}}>Conclusion</Text>
                        <Text style={{fontSize:11,marginTop:5}}>• Chance of <Text style={{opacity:0.5}}>{data.melanomaId}</Text> being malignant:</Text>
                        <View style={{flexDirection:"row",width:"100%",alignItems:"center",justifyContent:"space-between",marginTop:10,padding:10}}>
                            <Text style={ results?.[data.melanomaId].mole_malignant_chance.answer == 1 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>Very Low</Text>
                            <Text style={ results?.[data.melanomaId].mole_malignant_chance.answer == 2 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>Low</Text>
                            <Text style={ results?.[data.melanomaId].mole_malignant_chance.answer == 3 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>Medium</Text>
                            <Text style={ results?.[data.melanomaId].mole_malignant_chance.answer == 4 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>High</Text>
                            <Text style={ results?.[data.melanomaId].mole_malignant_chance.answer == 5 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>Extreme</Text>
                        </View>
                        {results?.[data.melanomaId].mole_malignant_chance.description != "" && <Text style={{fontSize:9,marginTop:7,paddingLeft:8,borderLeftWidth:1,marginLeft:5}}>{results?.[data.melanomaId].mole_malignant_chance.description}</Text>}
                        <Text style={{fontSize:11,marginTop:30}}>• Chance of evolving into malignant <Text style={{opacity:0.5,fontSize:10}}>( Based on response: Itching, Bleeding, Sun exposure ...)</Text></Text>
                        <View style={{flexDirection:"row",width:"100%",alignItems:"center",justifyContent:"space-between",marginTop:10,padding:10}}>
                            <Text style={ results?.[data.melanomaId].mole_evolution_chance.answer == 1 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>Very Low</Text>
                            <Text style={ results?.[data.melanomaId].mole_evolution_chance.answer == 2 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>Low</Text>
                            <Text style={ results?.[data.melanomaId].mole_evolution_chance.answer == 3 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>Medium</Text>
                            <Text style={ results?.[data.melanomaId].mole_evolution_chance.answer == 4 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>High</Text>
                            <Text style={ results?.[data.melanomaId].mole_evolution_chance.answer == 5 ? {fontSize:13,opacity:1} : {fontSize:13,opacity:0.3}}>Extreme</Text>
                        </View>
                        {results?.[data.melanomaId].mole_evolution_chance.description != "" && <Text style={{fontSize:9,marginTop:7,paddingLeft:8,borderLeftWidth:1,marginLeft:5}}>{results?.[data.melanomaId].mole_evolution_chance.description}</Text>}
                        <Text style={{fontSize:11,marginTop:30}}>• Advice:</Text>
                        {results?.[data.melanomaId].mole_advice != "" && <Text style={{fontSize:9,marginTop:7,paddingLeft:8,borderLeftWidth:1,marginLeft:5}}>{results?.[data.melanomaId].mole_advice}</Text>}
                    </View>
                </View>
            ))}
        </View>
        <View style={{margin:30}}>
            <Text style={{fontSize:20}}>Analasis Conclusion</Text>
            <View style={{borderLeftWidth:2,paddingLeft:20,marginTop:15}}>
                <Text style={{fontSize:11,marginTop:10}}>• Chance of developing skin cancer based on your medical information <Text style={{opacity:0.5,fontSize:10}}>( Family, Sun exposure ...)</Text></Text>
                <View style={{flexDirection:"row",width:"100%",alignItems:"center",justifyContent:"space-between",marginTop:15}}>
                    <Text style={{fontSize:13,opacity:0.3}}>Very Low</Text>
                    <Text style={{fontSize:13,opacity:0.3}}>Low</Text>
                    <Text style={{fontSize:13,opacity:0.3}}>Medium</Text>
                    <Text style={{fontSize:13,opacity:1}}>High</Text>
                    <Text style={{fontSize:13,opacity:0.3}}>Extreme</Text>
                </View>
            </View>
        </View>
      </Page>
    </Document>
  );
