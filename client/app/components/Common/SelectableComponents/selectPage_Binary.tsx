import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';


interface SelectionPageProps {
    pageStyle?: ViewStyle;    
    titleStyle?: TextStyle;
    pageTitle: { text: () => JSX.Element };        
    setProgress: (progress: boolean) => void;    
}

export const SelectionPage_Binary: React.FC<SelectionPageProps> = ({
    pageStyle = {},
    titleStyle = {},
    pageTitle,    
    setProgress,
}) => {
    const handlePress = (value:boolean) => {
        setProgress(value);
    };

    return (
        <View style={[styles.startScreen, pageStyle]}>        
            <View style={[{marginTop:100,alignItems:"center",backgroundColor:"rgba(0,0,0,0.04)",padding:20,borderRadius:10,width:"90%"},titleStyle]}>  
                {pageTitle.text()}
            </View>
            <View style={{ width: '100%', alignItems: 'center' }}>        
                <Pressable
                    onPress={() => handlePress(true)}
                    style={[styles.startButton, { marginBottom: 20 }]}
                >
                    <Text style={{ padding: 15, fontWeight: '600', color: 'white' }}>Yes</Text>
                </Pressable>
                
                <Pressable
                    onPress={() => handlePress(false)}
                    style={[styles.startButton, { marginBottom: 20,backgroundColor:"white" }]}
                >
                    <Text style={{ padding: 15, fontWeight: '600',color:"black" }}>No</Text>
                </Pressable>
            </View>       
        </View>
    );
};

const styles = StyleSheet.create({
    startButton: {
        borderWidth: 1,
        alignItems: 'center',
        width: '90%',
        borderRadius: 10,
        backgroundColor: 'black',
        marginBottom: 20,
    },
    startScreen: {
        borderWidth: 0,
        padding: 5,
        width: '100%',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
});
