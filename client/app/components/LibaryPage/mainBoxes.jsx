import { Text,View,TouchableOpacity } from "react-native"
import ProgressBar from 'react-native-progress/Bar';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { styles } from "../../styles/libary_style";
import PagerView from 'react-native-pager-view';
import { styles_shadow } from "../../styles/shadow_styles";


export function MainMelanomaBox({
    skinCancerData,
    skinCancerProgress,
    handleNavigation,
}){
    return ( 
        <View style={[styles.selectBox,styles_shadow.hightShadowContainer]}> 
            <View style={styles.boxTop}>
                <View style={{flexDirection:"row"}}>
                    <MaterialCommunityIcons 
                        name='liquid-spot'
                        size={30}
                    />
                    <View style={{marginLeft:20}}>
                        <Text style={{fontWeight:"800",fontSize:16}}>Skin Cancer Monitor</Text>
                        <Text style={{fontWeight:"600",fontSize:10,marginTop:3,maxWidth:"85%",opacity:0.6}}>All monitored moles: <Text style={{fontWeight:"800",fontSize:12}}>{skinCancerData.all}</Text></Text>
                    </View>
                </View>    
                <MaterialCommunityIcons 
                    name='bell'
                    size={20}
                    color={"black"}
                    opacity={0.4}
                />
            </View>                                                                                                                          
            <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",width:300}}>
            <View style={{marginTop:20,width:"90%",borderLeftWidth:0.3,borderColor:"magenta",paddingLeft:10,opacity:0.6}}>                     
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>Malignant Moles: <Text style={{fontWeight:"800",color:"red"}}>{skinCancerData.malignant}</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>Bening Moles: <Text style={{fontWeight:"800",color:"green"}}>{skinCancerData.bening}</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>Outdated Moles: <Text style={{fontWeight:"800",}}>{skinCancerData.outdated}</Text></Text>
                <Text style={{fontSize:14,fontWeight:"700",marginTop:20}}>Monitored Areas</Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}><Text style={{color:"magenta"}}>✓</Text> Marked as Completed: <Text style={{fontWeight:"800"}}><Text style={{color:"magenta"}}>{skinCancerData.completed}</Text> / 24</Text></Text>           
            </View>
            <View style={{marginTop:20}}>                            
                <ProgressBar progress={skinCancerProgress} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
            </View>  
            </View>    
            <View style={{
                marginTop:10,
                flexDirection:"row",
                justifyContent:"space-between",
                width:"100%",
                padding:5,
                alignItems:"center"                
            }}>                                
                <TouchableOpacity  onPress={() => handleNavigation("MelanomaCenter")} style={{width:"100%",backgroundColor:"black",padding:10,paddingVertical:15,alignItems:"center",justifyContent:"center",borderRadius:50,flexDirection:"row"}}>
                    <Text style={{fontWeight:"600",color:"white",marginRight:15}}>Open</Text>
                    <MaterialCommunityIcons 
                        name='arrow-right'
                        size={20}
                        color={"magenta"}                                                                        
                    />
                </TouchableOpacity>                            
            </View>    
        </View> 
    )
}

export function MainBloodBox({
    currentPage,
    navigation,
    handleScrollReminder
}){
    function SingleBloodBox(isLatest){
        return(
            <View style={{flexDirection:"column",alignItems:"center",width:300,height:315,justifyContent:"space-between"}}>
            <View style={{marginTop:20,width:"90%",borderLeftWidth:0.3,borderColor:"magenta",paddingLeft:10,opacity:0.6}}>
            { isLatest ? <Text style={{fontSize:12,fontWeight:"700",marginTop:5,opacity:0.5,color:"magenta"}}>Most up to date</Text>:<Text style={{fontSize:12,fontWeight:"700",marginTop:5,opacity:0.5,color:"red"}}>Outdated, but valuable for AI to make comparisons between blood works</Text>      }                                       
                <Text style={{fontSize:12,fontWeight:"700",marginTop:5}}>Date: <Text style={{fontWeight:"300"}}>3 days - 2003.11.17</Text></Text>                                 
                <Text style={{fontSize:14,fontWeight:"700",marginTop:20}}>Your Added Data</Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>1. Basic Health Indicators: <Text style={{fontWeight:"800"}}>0/5</Text>  <Text style={{color:"lightgreen"}}>(✓)</Text> </Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>2. Lipid Panel: <Text style={{fontWeight:"800"}}>0/4</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>3. Iron Studies: <Text style={{fontWeight:"800"}}>0/4</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>4. Liver Function Tests: <Text style={{fontWeight:"800"}}>0/6</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>5. Metabolic Panel: <Text style={{fontWeight:"800"}}>0/8</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>6. Thyroid Panel: <Text style={{fontWeight:"800"}}>0/3</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>7. Inflammatory Markers: <Text style={{fontWeight:"800"}}>0/2</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>8. Hormonal Panel : <Text style={{fontWeight:"800"}}>0/3</Text></Text>
                <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>9. Vitamins & Minerals: <Text style={{fontWeight:"800"}}>0/3</Text></Text>
            </View>
            <View style={{marginTop:20}}>                            
                <ProgressBar progress={0.2} width={250} height={5} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
            </View>  
            </View>    
        )
    }

    return(
        <View style={styles.selectBox}>
        <View style={styles.boxTop}>
            <View style={{flexDirection:"row"}}>
                <MaterialCommunityIcons 
                    name='water-plus'
                    size={30}                                   
                />
                <View style={{marginLeft:20}}>
                    <Text style={{fontWeight:"800",fontSize:16}}>Blood Work Center</Text>
                    <Text style={{fontWeight:"400",fontSize:10,marginTop:3,maxWidth:"85%",opacity:0.4}}>Number of blood works: 2</Text>
                </View>
            </View>    
            <MaterialCommunityIcons 
                name='bell'
                size={20}
                color={"black"}
                opacity={0.4}
            />
        </View>                          
        <PagerView style={{marginTop:0,height:315,width:"100%", alignItems:"center",justifyContent:"center" }} onPageScroll={(e) => handleScrollReminder(e)} initialPage={0}>
        {SingleBloodBox(isLatest=true) }
        {SingleBloodBox(isLatest=false) }  
        </PagerView>
        <View style={styles.IndicatorContainer}>               
            <View style={[styles.Indicator, { opacity: currentPage === 0 ? 1 : 0.3 }]} />   
            <View style={[styles.Indicator, { opacity: currentPage === 1 ? 1 : 0.3 }]} />                                                                              
        </View>                     
        <View style={[styles.boxBottom,{marginTop:5}]}>                                
            <TouchableOpacity onPress={() => navigation.navigate("BloodCenter")} style={{width:"100%",backgroundColor:"black",padding:10,paddingVertical:15,alignItems:"center",justifyContent:"center",borderRadius:50,flexDirection:"row"}}>
                <Text style={{fontWeight:"600",color:"white",marginRight:15}}>Open</Text>
                <MaterialCommunityIcons 
                    name='arrow-right'
                    size={15}
                    color={"magenta"}                                                                        
                />
            </TouchableOpacity>                            
        </View>      
</View>
    )
}

export function MainDiagnosisBox({
    data,
    navigation
}){
    return(
        <View key={data.id} style={styles.selectBox}>
        <View style={styles.boxTop}>
            <View style={{flexDirection:"row"}}>
                <MaterialCommunityIcons 
                    name='magnify'
                    size={30}
                />
                <View style={{marginLeft:20}}>
                    <Text style={{fontWeight:"800",fontSize:16}}>{data.title}</Text>
                    <Text style={{fontWeight:"400",fontSize:14,marginTop:3}}>Diagnosis: <Text style={{fontWeight:"600",opacity:0.5}}>{data.diagnosis}</Text></Text>
                </View>
            </View>        
        </View>
        <View style={{marginTop:20,width:"90%",borderLeftWidth:0.3,borderColor:"magenta",paddingLeft:10,opacity:0.6}}>                                                  
            <Text style={{fontSize:12,fontWeight:"700",marginTop:5}}>Reported symphtoms: <Text style={{fontWeight:"300"}}>{data.clientSymphtoms}</Text></Text>
            <Text style={{fontSize:12,fontWeight:"700",marginTop:5}}>Report Date: <Text style={{fontWeight:"300"}}>3 days ago • {data.created_at}</Text></Text>
            <Text style={{fontSize:14,fontWeight:"700",marginTop:10}}>Stages</Text>
            <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>1. Hypothesis: {data.stages.stage_one == null ? <Text style={{color:"red",fontSize:10}}>NOT STARTED</Text> : <Text style={{color:"green",fontSize:10}}>DONE (✓)</Text>} </Text>
            <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>2. Chance Evaluating: {data.stages.stage_two == null ? <Text style={{color:"red",fontSize:10}}>NOT STARTED</Text> : <Text style={{color:"green",fontSize:10}}>DONE (✓)</Text>} </Text>
            <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>3. Sustained Sympthoms Test: {data.stages.stage_three == null ? <Text style={{color:"red",fontSize:10}}>NOT STARTED</Text> : <Text style={{color:"green",fontSize:10}}>DONE (✓)</Text>} </Text>
            <Text style={{fontSize:12,fontWeight:"500",marginTop:5}}>4. Solution: {data.stages.stage_four == null ? <Text style={{color:"red",fontSize:10}}>NOT STARTED</Text> : <Text style={{color:"green",fontSize:10}}>DONE (✓)</Text>} </Text>
        </View>
        <View style={{marginTop:30}}>
        <Text style={{fontSize:12,fontWeight:"500",marginBottom:7,opacity:0.6}}>Diagnosis Stage:  <Text style={{fontWeight:"600",marginBottom:7,opacity:0.4}}>
            {data.stages.stage_one == null && data.diagnosis == "Not yet" ? 
            "1/4 • Hyphotesis"
            :
            data.stages.stage_two == null && data.stages.stage_one != null && data.diagnosis != "Not yet" ?
            "2/4 • Chance Evaluating"
            :
            data.stages.stage_three == null && data.stages.stage_one != null && data.diagnosis != "Not yet" &&  data.stages.stage_two != null  ?
            "3/4 • Sustained Symothoms Test"
            :            
            "4/4 • Solution"
            }</Text>
        </Text>
            <ProgressBar progress={(data.diagnosis == "Not yet" ? 0 : data.diagnosis != "Not yet" ? 1 : data.stages.stage_two != null ? 2 :data.stages.stage_three != null && 3 )/ 4} width={250} height={4} color={"magenta"} backgroundColor={"white"} borderColor={"magenta"} />
        </View>                     
        <View style={[styles.boxBottom,{marginTop:5}]}>                                
            <TouchableOpacity onPress={() => navigation.navigate("DiagnosisCenter",{diagnosisData:data})} style={{width:"100%",backgroundColor:"black",padding:10,paddingVertical:12,alignItems:"center",justifyContent:"center",borderRadius:20,flexDirection:"row"}}>
                <Text style={{fontWeight:"600",color:"white",marginRight:15}}>Open</Text>
                <MaterialCommunityIcons 
                    name='arrow-right'
                    size={15}
                    color={"magenta"}                                                                      
                />
            </TouchableOpacity>                            
        </View>      
        </View>  
    )
}