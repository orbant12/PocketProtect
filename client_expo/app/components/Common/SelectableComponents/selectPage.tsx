import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OptionsBoxes } from './optionBoxes';
import { SelectableBars } from './selectableBars';
import { Navbar_Selectable } from '../../../pages/Assist/assistCenter';

interface IconMetaData {
  name: string;
  size: number;
  color?: string;
  style?: {};
}

export interface SelectableDataItem {
  title: string;
  type: number | string;
  icon: 
    | { type: "icon", metaData:{name:string ,size?:number,color?:string,style?:{}}}
    | { type: "image", metaData:{name:string ,size?:number,color?:string,style?:{}}};
  container?:any;
  active?:boolean;
}

interface ButtonActionNext {
  type: 'next';
  actionData: {
    progress: number;
    increment_value: number;
  };
}

interface ButtonActionTrigger {
  type: 'trigger';
  actionData: {
    triggerAction: () => void;
  };
}

type ButtonAction = ButtonActionNext | ButtonActionTrigger;

interface SelectionPageProps {
  pageStyle?: ViewStyle;
  selectableStyle?: ViewStyle;
  pageTitle: string;
  selectableOption: 'box' | 'bar';
  buttonAction: ButtonAction;
  selectableData: SelectableDataItem[];
  setOptionValue: (value: any) => void;
  optionValue: any;
  setProgress: (progress: number) => void;
  specialValues?: number[];
  handleEvent?: () => void;
  desc?: string;
  showButton?: boolean;
  isMap?: boolean;
  topPager?:{
    activeItem:any;
    setActiveItem:(item:any) => void;
    navItems:{value:string,title:string}[];
  }
}

export const SelectionPage: React.FC<SelectionPageProps> = ({
  pageStyle = {},
  selectableStyle = {},
  pageTitle,
  selectableOption,
  buttonAction,
  selectableData,
  setOptionValue,
  optionValue,
  setProgress,
  specialValues = [],
  handleEvent,
  desc,
  showButton = true,
  isMap = false,
  topPager, 
}) => {
  return (
    <View style={[styles.startScreen, pageStyle]}>
      <View style={{marginTop:0,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:10,padding:10,width:"90%"}}>  
        <Text style={{marginBottom:0,fontWeight:"700",fontSize:23,textAlign:"left"}}>{pageTitle}</Text>
        {desc != undefined &&
        <View style={{width:"100%",backgroundColor:"rgba(0,0,0,0.1)",padding:7,borderRadius:5,marginTop:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
            <MaterialCommunityIcons 
                name="information"
                color={"black"}
                size={30}
                style={{width:"10%",opacity:0.6}}
            />
            <Text style={{textAlign:"left",fontWeight:"600",opacity:0.6,fontSize:11,width:"87%"}}>{desc}</Text>
        </View>
        }
      </View>
      {topPager != undefined && <Navbar_Selectable 
            activeItem={topPager.activeItem}
            setActiveItem={(item) => {topPager.setActiveItem(item)}}
            navItems={topPager.navItems}
        />}
      {selectableOption === 'box' && (
        <OptionsBoxes
          items={selectableData}
          setOptionValue={setOptionValue}
          optionValue={optionValue}
          style={selectableStyle}
          isMap={isMap}
          pagerActive={topPager.activeItem}
        />
      )}
      {selectableOption === 'bar' && (
        <SelectableBars
          items={selectableData}
          setOptionValue={setOptionValue}
          optionValue={optionValue}
          style={selectableStyle}
        />
      )}
      {(showButton != false && showButton != undefined) &&
      <View style={{ width: '100%', alignItems: 'center' }}>
        {optionValue != null ? ( 
          <Pressable
            onPress={() => {
              if (buttonAction.type === 'next' && !specialValues.includes(optionValue)) {
                setProgress(buttonAction.actionData.progress + buttonAction.actionData.increment_value);
              } else if (specialValues.includes(optionValue)) {
                handleEvent();
              }
            }}
            style={[styles.startButton, { position: 'relative' }]}
          >
            <Text style={{ padding: 15, fontWeight: "600", color: 'white' }}>Next</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.startButtonNA}>
            <Text style={{ padding: 15, fontWeight: "600" }}>Not Selected Yet</Text>
          </Pressable>
        )}
      </View>
}
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
  },
  startButtonNA: {
    borderWidth: 1,
    alignItems: 'center',
    width: '90%',
    borderRadius: 20,
    marginBottom: 20,
    opacity: 0.3,
  },
  startScreen: {
    borderWidth: 0,
    padding: 5,
    width: '100%',
    alignItems: 'center',
    height: '90%',
    justifyContent: 'space-between',
    marginBottom: "5%",
    backgroundColor: 'white',
    zIndex: -1,
  },
});
