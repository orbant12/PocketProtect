import { ScrollView } from "react-native";
import { View,Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const QuestionBox = ({
    title,
    q,
    icon,
    handlePreQuestion
  }:{ 
    title:string;
    q:string;
    icon:string;
    handlePreQuestion: (arg:string) => void
  }) => {
    return(
      <View style={[{width:170,height:170,borderWidth:0.2,borderRadius:10,margin:5,flexDirection:"column",padding:10,justifyContent:"space-between",borderColor:"magenta"},{backgroundColor:"rgba(250,0,250,0.2)"}]}>
        <MaterialCommunityIcons 
          name={icon}
          size={30}
          color={"white"}
          style={{padding:5}}
        />
        <View style={{width:"100%",marginTop:15}}>
          <Text style={{color:"white",fontWeight:"700",fontSize:16}}>{title}</Text>
          <Text numberOfLines={2} style={{color:"white",fontWeight:"600",fontSize:11,opacity:0.8,marginTop:5}}>{q}</Text>
        </View>
        <TouchableOpacity onPress={() => handlePreQuestion(q)} style={[{flexDirection:"row",alignItems:"center",borderWidth:0.3,borderColor:"black",borderRadius:5,padding:0,justifyContent:"center",backgroundColor:"white",marginTop:10,height:30}]}>
          <Text style={{color:"black",marginRight:10,fontWeight:"600",fontSize:12,padding:4}}>Ask</Text>
          <MaterialCommunityIcons 
            name='arrow-right'
            color={"magenta"}
            size={15}
          />
        </TouchableOpacity>
      </View>
    )
  }


const QuestionContainer = ({
title,
boxes,
handlePreQuestion
}:{
title:string;
boxes:{title:string,q:string,icon:string}[];
handlePreQuestion: (arg:string) => void;
}) => {
return(
    <>
    <Text style={{fontWeight:"700",fontSize:20,padding:10,alignSelf:"flex-start",marginTop:20,color:"white"}}>{title}</Text>
    <View style={{flexWrap:"wrap",width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
        {boxes.map((data,index) => (
            <QuestionBox 
                title={data.title}
                q={data.q}
                icon={data.icon}
                handlePreQuestion={handlePreQuestion}
            />
        ))}
    </View>
    </>
)
}

  export const QuestionsSheet = ({
    handlePreQuestion
  }:{
    handlePreQuestion: (arg:string) => void;
  }) => {

    return(
      <ScrollView contentContainerStyle={{flexDirection:"column",alignItems:"center",paddingBottom:100}} style={{width:"100%",backgroundColor:"rgba(0,0,0,1)",height:"100%"}}>
          <QuestionContainer 
            handlePreQuestion={handlePreQuestion}
            title={"Blood Work"}
            boxes={[
              {title:"Insight",q:"Can you give me insight on my blood work ?",icon:"water-alert"},
              {title:"Explain",q:"Can you explain what my blood results mean ?",icon:"chart-waterfall"},
              {title:"Abnormalities",q:"Any blood abnormalities to discuss with a doctor?",icon:"water-remove"},
              {title:"Supplements",q:"Any supplements needed based on my blood test ?",icon:"pill"}
            ]}
          />
        <QuestionContainer 
            handlePreQuestion={handlePreQuestion}
            title={"UV Data"}
            boxes={[
              {title:"Sun Screen",q:"How much sunscreen for today's weather?",icon:"shield-sun-outline"},
              {title:"Skin Type Based",q:"Is it safe for my skin type to be in the sun today ?",icon:"alert-decagram-outline"},
              {title:"Skin Cancer",q:"How does today's UV index affect my skin cancer risk ?",icon:"sun-wireless"},
              {title:"SPF Level",q:"What SPF sunscreen is recommended for today ?",icon:"sun-thermometer"}
            ]}
          />
        <QuestionContainer 
            handlePreQuestion={handlePreQuestion}
            title={"Medical Data"}
            boxes={[
              {title:"BMI",q:"Provide some insights based on my BMI score !",icon:"human"},
              {title:"Explain",q:"Can you explain what my blood results mean ?",icon:"human-male-board-poll"},
              {title:"Abnormalities",q:"Any blood abnormalities to discuss with a doctor?",icon:"water"},
              {title:"Blood Work Explain",q:"Can you explain what my blood results mean ?",icon:"doctor"}
            ]}
          />
        <QuestionContainer 
            handlePreQuestion={handlePreQuestion}
            title={"BMI"}
            boxes={[
              {title:"Insight",q:"Provide some insights based on my BMI score !",icon:"human"},
              {title:"Improove",q:"How can I improve my BMI score ?",icon:"chart-timeline-variant-shimmer"},
              {title:"Healthy BMI",q:"BMI range for someone of my age and height !",icon:"human-male-board-poll"},
              {title:"Potential Risks",q:"Risks I should be aware of based on my BMI ?",icon:"badge-account-alert"}
            ]}
          />
        <QuestionContainer 
            handlePreQuestion={handlePreQuestion}
            title={"Weather Data"}
            boxes={[
              {title:"Insight",q:"Provide some insights based on my BMI score !",icon:"water"},
              {title:"Explain",q:"Can you explain what my blood results mean ?",icon:"doctor"},
              {title:"Abnormalities",q:"Any blood abnormalities to discuss with a doctor?",icon:"water"},
              {title:"Blood Work Explain",q:"Can you explain what my blood results mean ?",icon:"doctor"}
            ]}
          />
      </ScrollView>
    )
  }