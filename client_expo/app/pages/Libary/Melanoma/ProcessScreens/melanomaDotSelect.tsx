import { BodyPart, Gender, SkinType, SpotData } from '../../../../utils/types';
import { BodyPartPath } from '../components/selectedSlugDots';
import { ClientMemory_Spots } from './melanomaSingleSlug';
import Svg, { Circle, Path,Text,G } from 'react-native-body-highlighter/node_modules/react-native-svg';

export const dotSelectOnPart = ({
    bodyPart,
    redDotLocation,
    currentSlugMemory,
    gender,
    highlighted,
    skinColor
}:{
    bodyPart: BodyPart,
    redDotLocation: {x:number,y:number},
    currentSlugMemory: ClientMemory_Spots[],
    gender:Gender,
    highlighted:string | null,
    skinColor:SkinType
}) => {
    return (
        <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 
    
                {bodyPart.pathArray.map((path:any, index:number) => (
                    <BodyPartPath
                        path={path}
                        index={index}
                        skin_type={skinColor}
                        bodyPart={bodyPart}
                        key={index}
                        userData={{gender:gender}}
                        stroke={"black"}
                    />
                ))}
    
                <Circle cx={redDotLocation.x} cy={redDotLocation.y} r="5" fill="red" />
                {currentSlugMemory.map((data,index) =>
                    highlighted != data.id ?
                    <G key={index}>
                        <Circle cx={data.location.x} cy={data.location.y} r="5" fill="black" />
                        <Text fill="black" x={data.location.x+5}  y={data.location.y-5}>{data.id}</Text>
                    </G>
                    :
                    <G key={index}>
                        <Circle cx={data.location.x} cy={data.location.y} r="5" fill="red" />
                        <Text fill="red" x={data.location.x+5}  y={data.location.y-5}>{data.id}</Text>
                    </G>
                )}
            
        </Svg>
    )
}