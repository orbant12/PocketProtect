

import Svg, { Circle, Path,TextPath,Text } from '/Users/tamas/Programming Projects/DetectionApp/node_modules/react-native-body-highlighter/node_modules/react-native-svg';

export const dotsSelectOnPart = ({
    bodyPart,
    userData,
    melanomaData,
}) => {
    return (
        <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 
            {
                bodyPart.pathArray.map((path, index) => (
                        <Path
                            key={`${bodyPart.slug}_${index}`} 
                            d={path}
                            fill="blue" 
                            stroke={bodyPart.color} 
                            strokeWidth="2"
                            rotation={
                                bodyPart.slug == "right-arm" ? "-20"
                                :
                                bodyPart.slug == "left-arm" ? "20"
                                :
                                null
                            }
                            transform={
                                userData.melanoma.gender == "male" ? (
                                    bodyPart.slug == "chest" ? `translate(-180 -270)` 
                                    :
                                    bodyPart.slug == "head" ? `translate(-140 -70)`
                                    :
                                    bodyPart.slug == "legs" ? `translate(-140 -100)`
                                    :
                                    bodyPart.slug == "torso" ? `translate(-140 -100)`
                                    :
                                    bodyPart.slug == "feet" ? `translate(-140 -100)`
                                    :
                                    bodyPart.slug == "abs" ? `translate(-60 -390)`
                                    :
                                    bodyPart.slug == "left-hand" ? `translate(40 -670)`
                                    :
                                    bodyPart.slug == "right-hand" ? `translate(-480 -670)`
                                    :
                                    bodyPart.slug == "left-arm" ? `translate(120 -420)`
                                    :
                                    bodyPart.slug == "right-arm" ? `translate(-300 -230)`
                                    :
                                    bodyPart.slug == "upper-leg-left" ? `translate(0 -650)`
                                    :
                                    bodyPart.slug == "upper-leg-right" ? `translate(-170 -650)`
                                    :
                                    bodyPart.slug == "lower-leg-left" ? `translate(-20 -950)`
                                    :
                                    bodyPart.slug == "lower-leg-right" ? `translate(-170 -950)`
                                    :
                                    bodyPart.slug == "left-feet" ? `translate(-130 -1200)`
                                    :
                                    bodyPart.slug == "right-feet" ? `translate(-290 -1200)`
                                    :null
                                    ):(
                                    bodyPart.slug == "chest" ? `translate(-145 -270)` 
                                    :
                                    bodyPart.slug == "head" ? `translate(-50 -10)`
                                    :
                                    bodyPart.slug == "legs" ? `translate(-140 -100)`
                                    :
                                    bodyPart.slug == "torso" ? `translate(-140 -100)`
                                    :
                                    bodyPart.slug == "feet" ? `translate(-140 -100)`
                                    :
                                    bodyPart.slug == "abs" ? `translate(-20 -380)`
                                    :
                                    bodyPart.slug == "left-hand" ? `translate(100 -630)`
                                    :
                                    bodyPart.slug == "right-hand" ? `translate(-460 -640)`
                                    :
                                    bodyPart.slug == "left-arm" ? `translate(180 -420)`
                                    :
                                    bodyPart.slug == "right-arm" ? `translate(-300 -230)`
                                    :
                                    bodyPart.slug == "upper-leg-left" ? `translate(0 -650)`
                                    :
                                    bodyPart.slug == "upper-leg-right" ? `translate(-110 -650)`
                                    :
                                    bodyPart.slug == "lower-leg-left" ? `translate(-20 -950)`
                                    :
                                    bodyPart.slug == "lower-leg-right" ? `translate(-120 -950)`
                                    :
                                    bodyPart.slug == "left-feet" ? `translate(-130 -1280)`
                                    :
                                    bodyPart.slug == "right-feet" ? `translate(-220 -1280)`
                                    :null
                                    )
                            }
                            scale={
                                userData.melanoma.gender == "male" ? (
                                    bodyPart.slug == "left-hand" ? "1.3" 
                                    : 
                                    bodyPart.slug == "right-hand" ? "1.3"
                                    :
                                    bodyPart.slug == "chest" ? "1" 
                                    :
                                    bodyPart.slug == "head" ? "0.8"
                                    :
                                    bodyPart.slug == "legs" ? "0.8"
                                    :
                                    bodyPart.slug == "torso" ? "0.8"
                                    :
                                    bodyPart.slug == "feet" ? "0.8"
                                    :
                                    bodyPart.slug == "abs" ? "0.6"
                                    :
                                    bodyPart.slug == "left-arm" ? "0.6"
                                    :
                                    bodyPart.slug == "right-arm" ? "0.6"
                                    :
                                    bodyPart.slug == "upper-leg-left" ? "0.65"
                                    :
                                    bodyPart.slug == "upper-leg-right" ? "0.65"
                                    :
                                    bodyPart.slug == "lower-leg-left" ? "0.7"
                                    :
                                    bodyPart.slug == "lower-leg-right" ? "0.7"
                                    :
                                    bodyPart.slug == "left-feet" ? "1.2"
                                    :
                                    bodyPart.slug == "right-feet" ? "1.2 "
                                    :
                                    null):(
                                    bodyPart.slug == "left-hand" ? "1.3" 
                                    : 
                                    bodyPart.slug == "right-hand" ? "1.3"
                                    :
                                    bodyPart.slug == "chest" ? "1" 
                                    :
                                    bodyPart.slug == "head" ? "0.65"
                                    :
                                    bodyPart.slug == "legs" ? "0.8"
                                    :
                                    bodyPart.slug == "torso" ? "0.8"
                                    :
                                    bodyPart.slug == "feet" ? "0.8"
                                    :
                                    bodyPart.slug == "abs" ? "0.6"
                                    :
                                    bodyPart.slug == "left-arm" ? "0.6"
                                    :
                                    bodyPart.slug == "right-arm" ? "0.6"
                                    :
                                    bodyPart.slug == "upper-leg-left" ? "0.65"
                                    :
                                    bodyPart.slug == "upper-leg-right" ? "0.65"
                                    :
                                    bodyPart.slug == "lower-leg-left" ? "0.7"
                                    :
                                    bodyPart.slug == "lower-leg-right" ? "0.7"
                                    :
                                    bodyPart.slug == "left-feet" ? "1.2"
                                    :
                                    bodyPart.slug == "right-feet" ? "1.2 "
                                    :
                                    null)
                                        }
                        />
                ))
            }
            {melanomaData.map((data) => (
                    data.melanomaDoc.spot[0].slug == bodyPart.slug ? (
                        <>
                            <Circle cx={data.melanomaDoc.location.x} cy={data.melanomaDoc.location.y} r="5" fill="red" />
                            <Text fill="red" x={data.melanomaDoc.location.x+5}  y={data.melanomaDoc.location.y-5}>
                                {data.melanomaId}
                            </Text>
                            
                        </>
                    ):null
                ))
            }
        </Svg>

    )
}