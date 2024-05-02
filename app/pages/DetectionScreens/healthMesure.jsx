import React from 'react';

import { View, Text, Pressable, ScrollView,StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HealthMesure = () => {
    return(
<ScrollView style={styles.container}>
    <View style={styles.personalScoreSection}>
        <View style={styles.scoreTitle}>
            <View style={styles.scoreTitleLeft}>
                <Text style={styles.titleTag}>Artifical Inteligence</Text>
                <Text style={{fontSize:20,fontWeight:'bold'}}>Personal Score</Text>
                <Text style={{fontSize:15}}>Your personal score is 0.0</Text>   
            </View>
            <MaterialCommunityIcons
                name="information-outline"
                size={30}
                color="black"
                style={{marginLeft:10}}
            />
        </View>
        <View style={styles.scoreCircle}>
            <Text style={{fontSize:50,fontWeight:'bold'}}>17</Text>
            <Text style={{fontSize:15,fontWeight:700}}>out of 100</Text>

        </View>

        <View style={styles.ResultsScoreSection}>
            <View style={styles.ResultsScoreTitleRow}>
                <Text style={{fontSize:18,fontWeight:700}}>Results</Text>
                <Pressable onPress={() => navigation.navigate("Assistant")}>
                    <Text style={{fontSize:13,fontWeight:500,opacity:0.7}}>My Data</Text>
                </Pressable>
            </View>
            <ScrollView horizontal style={{paddingBottom:20}} >
                <View style={styles.ResultBox}>
                    <MaterialCommunityIcons
                        name="heart-pulse"
                        size={50}
                        color="black"
                    />
                    <Text style={styles.BoxPoint}>+5 points</Text>
                    <Text style={styles.BoxTitle}>Balanced Blood Work</Text>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>

                <View style={styles.ResultBox}>
                    <MaterialCommunityIcons
                        name="heart-pulse"
                        size={50}
                        color="black"
                    />
                    <Text style={styles.BoxPoint}>+5 points</Text>
                    <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>

                <View style={styles.ResultBox}>
                    <MaterialCommunityIcons
                        name="heart-pulse"
                        size={50}
                        color="black"
                    />
                    <Text style={styles.BoxPoint}>+5 points</Text>
                    <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>

                <View style={styles.ResultBox}>
                    <MaterialCommunityIcons
                        name="heart-pulse"
                        size={50}
                        color="black"
                    />
                    <Text style={styles.BoxPoint}>+5 points</Text>
                    <Text style={styles.BoxTitle}>Balanced Blood Work</Text>


                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>
            </ScrollView>
        </View>

        <View style={styles.DetectionSection}>
            <View style={styles.ResultsScoreTitleRow}>
            <View style={styles.scoreTitle}>
            <View style={styles.scoreTitleLeft}>
                <Text style={styles.titleTag}>Artifical Inteligence</Text>
                <Text style={{fontSize:20,fontWeight:'bold'}}>Diases Detection</Text>
                <Text style={{fontSize:15}}>Your personal score is 0.0</Text>   
            </View>
            <MaterialCommunityIcons
                name="information-outline"
                size={30}
                color="black"
                style={{marginLeft:10}}
            />
        </View>
            </View>
                <View style={styles.DetectBox}>
                    <MaterialCommunityIcons
                        name="heart-pulse"
                        size={50}
                        color="black"
                    />
                    <Text style={styles.BoxPoint}>+5 points</Text>
                    <Text style={styles.BoxTitle}>Balanced Blood Work</Text>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="black"
                        style={{position:'absolute',top:0,right:0}}
                    />
                </View>     
        </View>

    </View>

</ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop:100
    },
    personalScoreSection: {
        padding: 20,
        borderBottomColor: 'black',
        alignItems: 'center',
        width: '100%',
    },
    titleTag: {
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
        borderWidth: 1,
        width: "57%",
        padding: 3,
        borderRadius: 5,
        marginBottom: 5,
    },
    scoreTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    scoreTitleLeft: {
        flexDirection: 'column',
        width: '55%',
        justifyContent:'space-between',
    },
    scoreCircle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 100,
        width: 170,
        height: 170,
        borderColor: 'black',
        marginTop: 20,
        borderStyle: 'dashed',
    },
    //RESULTS
    ResultsScoreSection: {
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent:'left',
        width: '100%',
        marginTop: 20,
    },
    ResultsScoreTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    ResultsScoreTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    ResultBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 150,
        height: 150,
        borderRadius: 10,
        marginRight: 20,
    },
    BoxTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    BoxPoint: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom:10
    },
    //DETECTION
    DetectionSection: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        marginTop: 20,
    },
    DetectBox: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 300,
        height: 150,
        borderRadius: 10,
        marginRight: 20,
    },

});

export default HealthMesure;