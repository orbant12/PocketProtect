import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconMetaData {
  name: string;
  size: number;
  color: string;
  style?: {};
}

interface Item {
  title: string;
  type: string;
  icon: {
    type: 'image' | 'icon';
    metaData: IconMetaData;
  };
}

interface OptionsBoxesProps {
  items: Item[];
  setOptionValue: (value: string) => void;
  optionValue: string;
  style?: StyleProp<ViewStyle>;
}

interface SelectableBoxProps {
  title: string;
  type: string;
  setOptionValue: (value: string) => void;
  optionValue: string;
  icon: {
    type: 'image' | 'icon';
    metaData: IconMetaData;
  };
}

export const OptionsBoxes: React.FC<OptionsBoxesProps> = ({
  items,
  setOptionValue,
  optionValue,
  style = {},
}) => {
  return (
    <ScrollView style={[{ width: '100%' }, style]} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} showsVerticalScrollIndicator={false}>
      <View style={[{ flexDirection: 'row', width: '90%', flexWrap: 'wrap', justifyContent: 'space-between', marginRight: 'auto', marginLeft: 'auto' }]}>
        {items.map((data) => (
          <SelectableBox
            key={data.type}
            setOptionValue={setOptionValue}
            optionValue={optionValue}
            title={data.title}
            type={data.type}
            icon={{ type: data.icon.type, metaData: data.icon.metaData }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  genderOptionButton: {
    flexDirection: 'column',
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    borderWidth: 0.3,
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    alignSelf: 'center',
  },
  genderOptionButtonA: {
    flexDirection: 'column',
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderColor: 'magenta',
    alignSelf: 'center',
  },
});

const SelectableBox: React.FC<SelectableBoxProps> = ({
  title,
  type,
  setOptionValue,
  optionValue,
  icon,
}) => {
  return (
    <Pressable onPress={() => setOptionValue(type)} style={optionValue === type ? styles.genderOptionButtonA : styles.genderOptionButton}>
      {icon.type === 'icon' && (
        <View style={{ padding: 5, backgroundColor: 'rgba(0,0,0,0.1)', opacity: 0.6, borderRadius: 50, marginBottom: 10 }}>
          <MaterialCommunityIcons
            name={icon.metaData.name}
            size={icon.metaData.size}
            color={icon.metaData.color}
            style={icon.metaData.style}
          />
        </View>
      )}
      {icon.type === 'image' && (
        <Image
          source={icon.metaData.name}
          style={[{ position: 'relative', width: icon.metaData.size !== undefined ? icon.metaData.size : 30, height: icon.metaData.size !== undefined ? icon.metaData.size : 30 }, icon.metaData.style]}
        />
      )}
      <Text style={{ fontWeight: "600", fontSize: 17 }}>{title}</Text>
    </Pressable>
  );
};
