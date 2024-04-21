import { View,Text,StyleSheet,Image, Pressable } from "react-native"


const FileCard = ({ navigation,props }) => {

    const handleNavigation = (props) => {
        navigation.navigate("ClipPage",{data:props,navigation})
    }

return(
<Pressable onPress={()=> handleNavigation(props)}>
    <View style={styles.boxContainer}>
        <Image
            style={{width: 100, height: 100}}
            source={{uri: props.img}}
        />
        <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",height:80}}>
            <Text style={styles.titleProp}>
                {props.title}
            </Text>
            <Text style={styles.textProp}>
                {props.related_count}
            </Text>
            <Text style={styles.textProp}>
                Tag: {props.tag}
            </Text>
        </View>
        <Text style={styles.textProp}>8MB</Text>
    </View>
</Pressable>
)
}

const styles = StyleSheet.create({
    boxContainer: {
        width: "90%",
        marginRight:"auto",
        marginLeft:"auto",
        height: 130,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#9effb1',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderBottomWidth:1,
        flexDirection: 'row',
        margin: 10,
    },
    textProp: {
        color:"white"
    },
    titleProp: {
        color:"white",
        fontWeight:800,
        fontSize:16,
    }
})


export default FileCard;