import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconMetaData {
  name: string;
  size: number;
  color?: string;
  style?: {};
}

interface SelectableDataItem {
  title: string;
  type: string | number;
  icon: 
    | { type: "icon", metaData:{name:string ,size?:number,color?:string,style?:{}}}
    | { type: "image", metaData:{name:string ,size?:number,color?:string,style?:{}}};
  active?:boolean;
}

interface SelectableBarsProps {
  optionValue: string | null;
  setOptionValue: (value: string | number) => void;
  items: SelectableDataItem[];
  style?: StyleProp<ViewStyle>;
}

interface SelectableBarProps {
  setOptionValue: (value: string | number) => void;
  optionValue: string | null;
  type: string | number;
  title: string;
  icon: 
    | { type: "icon", metaData:{name:string ,size?:number,color?:string,style?:{}}}
    | { type: "image", metaData:{name:string ,size?:number,color?:string,style?:{}}};

}

export const SelectableBars: React.FC<SelectableBarsProps> = ({
  optionValue,
  setOptionValue,
  items,
  style,
}) => {
  return (
    <ScrollView style={[{ width: '100%', marginTop: 10 }, style]}>
      {items.map((data, index) => (
        <SelectableBar
          key={index}
          optionValue={optionValue}
          setOptionValue={setOptionValue}
          type={data.type}
          title={data.title}
          icon={data.icon}
          active={data.active}
        />
      ))}
    </ScrollView>
  );
};

const SelectableBar = ({
  setOptionValue,
  optionValue,
  type,
  title,
  icon,
  active
}:{
  setOptionValue:any;
  optionValue:any;
  type:any;
  title:string;
  icon:any;
  active?:boolean
}) => {
  return (
    <TouchableOpacity
      onPress={() => setOptionValue(type)}
      style={[
        {
          width: '95%',
          padding: 0,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderRadius: 10,
          alignSelf: 'center',
          marginTop: 20,
        },
        optionValue === type && active != false && { borderColor: 'magenta' },
        active != undefined && active == false && {opacity:0.4}
      ]}
    >
      {icon.type === 'icon' && (
        <View
          style={[
            {
              borderWidth: 0,
              padding: 15,
              borderRightWidth: 2,
              borderRadius: 10,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
            optionValue === type && active != false && { borderColor: 'magenta' },
          ]}
        >
          <MaterialCommunityIcons
            name={icon.metaData.name}
            size={icon.metaData.size}
            color={optionValue === type && active != false ? 'magenta' : 'black'}
          />
        </View>
      )}
      {icon.type === 'image' && (
        <Image
          source={{ uri: icon.metaData.name }}
          style={[
            {
              position: 'relative',
              width: icon.metaData.size !== undefined ? icon.metaData.size : 30,
              height: icon.metaData.size !== undefined ? icon.metaData.size : 30,
            },
            icon.metaData.style,
          ]}
        />
      )}
      <Text style={{ marginLeft: 20, fontWeight: "700", fontSize: 17, opacity: 0.7 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
