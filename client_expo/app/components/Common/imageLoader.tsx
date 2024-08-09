import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import { SpotData } from "../../utils/types";
import { Image,View } from "react-native";


export const ImageLoaderComponent = ({ data,w,h,style,imageStyle  }:{data:SpotData | {melanomaPictureUrl:string}; w:number | string; h:number | string;style?:any,imageStyle?:any}) => {

    const [loading, setLoading] = useState<boolean>(true);

    const imageLoad = useRef(null);

    return(
        <View style={[{ position: 'relative', width: w, height: h,borderColor:"black",borderWidth:0.3,borderRadius:10,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"#ebebeb" },style]}>
        {/* Animated Gradient Loader */}
        {loading && (
            <LottieView
                autoPlay
                ref={imageLoad}
                style={{
                    width: typeof w === 'string' ? w : w - 8,
                    height: typeof h === 'string' ? h : h - 8,
                    borderRadius:10,
                    backgroundColor: '#fffff',
                }}
                source={require('./AnimationSheets/lotties/imageLoad.json')}
            />
        )}
        
        {/* Image */}
        <Image 
            source={{ uri: data.melanomaPictureUrl }}
            style={[{ width: w , height: h, borderWidth: 0.3, borderRadius: 10, position: 'absolute' },imageStyle]}
            onLoadEnd={() => setLoading(false)}
            onLoadStart={() => setLoading(true)}
        />

    </View>
    )
}