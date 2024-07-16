import { View, SafeAreaView} from "react-native"

export const HeaderContainer = ({
    outerBg,
    content
}) => {
    return (
      <View style={{backgroundColor:outerBg}}>
        <SafeAreaView>
          {content()}
        </SafeAreaView>
      </View>
    );
}