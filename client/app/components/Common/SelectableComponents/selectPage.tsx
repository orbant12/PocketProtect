import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OptionsBoxes } from './optionBoxes';
import { SelectableBars } from './selectableBars';

interface IconMetaData {
  name: string;
  size: number;
  color?: string;
  style?: {};
}

interface SelectableDataItem {
  title: string;
  type: number | string;
  icon: 
    | { type: "icon", metaData:{name:string ,size?:number,color?:string,style?:{}}}
    | { type: "image", metaData:{name:string ,size?:number,color?:string,style?:{}}};
  
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
  handleEvent
}) => {
  return (
    <View style={[styles.startScreen, pageStyle]}>
      <Text style={{ marginBottom: 10, fontWeight: "800", fontSize: 20, marginTop: 60 }}>{pageTitle}</Text>
      {selectableOption === 'box' && (
        <OptionsBoxes
          items={selectableData}
          setOptionValue={setOptionValue}
          optionValue={optionValue}
          style={selectableStyle}
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
            style={[styles.startButton, { position: 'relative', marginBottom: 20 }]}
          >
            <Text style={{ padding: 15, fontWeight: "600", color: 'white' }}>Next</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.startButtonNA}>
            <Text style={{ padding: 15, fontWeight: "600" }}>Not Selected Yet</Text>
          </Pressable>
        )}
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
    position: 'absolute',
    bottom: 20,
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
    height: '100%',
    justifyContent: 'space-between',
    marginBottom: 0,
    backgroundColor: 'white',
    zIndex: -1,
  },
});
