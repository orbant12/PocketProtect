import Svg, { Circle, Path,Text } from '/Users/tamas/Programming Projects/DetectionApp/client/node_modules/react-native-body-highlighter/node_modules/react-native-svg';

export const dotSelectOnPart = ({
    bodyPart,
    redDotLocation,
    currentSlugMemory,
    gender,
    highlighted,
    skinColor
}) => {
    return (
        <Svg preserveAspectRatio="xMidYMid meet" height={200} width={350} > 
    
                {bodyPart.pathArray.map((path, index) => (
                        <Path
                            key={`${bodyPart.slug}_${index}`} 
                            d={path}
                            fill={skinColor == 0 ? "#fde3ce" : skinColor == 1 ? "#fbc79d" : skinColor == 2 ? "#934506" : skinColor == 3 ? "#311702":null} 
                            stroke={bodyPart.color} 
                            strokeWidth="2"
                            rotation={
                                bodyPart.slug == "right-arm" ? "-20"
                                :
                                bodyPart.slug == "left-arm" ? "20"
                                :
                                bodyPart.slug == "right-arm(back)" ? "-20"
                                :
                                bodyPart.slug == "left-arm(back)" ? "20"
                                :
                                null
                            }
                            transform={
                                gender == "male" ? (
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
                                    :
                                    //BACK
                                    bodyPart.slug == "head(back)" ? `translate(-860 -80)`
                                    :
                                    bodyPart.slug == "back" ? `translate(-800 -290)`
                                    :
                                    bodyPart.slug == "left-arm(back)" ? `translate(-600 -430)`
                                    :
                                    bodyPart.slug == "right-arm(back)" ? `translate(-1000 -230)`
                                    :
                                    bodyPart.slug == "gluteal" ? `translate(-900 -590)`
                                    :
                                    bodyPart.slug == "right-palm" ? `translate(-1190 -675)`
                                    :
                                    bodyPart.slug == "left-palm" ? `translate(-680 -670)`
                                    :
                                    bodyPart.slug == "left-leg(back)" ? `translate(-550 -750)`
                                    :
                                    bodyPart.slug == "right-leg(back)" ? `translate(-700 -750)`
                                    :
                                    bodyPart.slug == "left-feet(back)" ? `translate(-840 -1230)`
                                    :
                                    bodyPart.slug == "right-feet(back)" ? `translate(-1000 -1230)`
                                    :
                                    null
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
                                    :
                                    //BACK
                                    bodyPart.slug == "head(back)" ? `translate(-900 -30)`
                                    :
                                    bodyPart.slug == "back" ? `translate(-850 -280)`
                                    :
                                    bodyPart.slug == "left-arm(back)" ? `translate(-650 -450)`
                                    :
                                    bodyPart.slug == "right-arm(back)" ? `translate(-1100 -230)`
                                    :
                                    bodyPart.slug == "gluteal" ? `translate(-960 -590)`
                                    :
                                    bodyPart.slug == "right-palm" ? `translate(-1270 -620)`
                                    :
                                    bodyPart.slug == "left-palm" ? `translate(-730 -630)`
                                    :
                                    bodyPart.slug == "left-leg(back)" ? `translate(-600 -750)`
                                    :
                                    bodyPart.slug == "right-leg(back)" ? `translate(-700 -750)`
                                    :
                                    bodyPart.slug == "left-feet(back)" ? `translate(-940 -1330)`
                                    :
                                    bodyPart.slug == "right-feet(back)" ? `translate(-1050 -1330)`
                                    
                                    :null
                                    )
                            }
                            scale={
                                gender == "male" ? (
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
                                    //BACK
                                    bodyPart.slug == "head(back)" ? "0.8"
                                    :
                                    bodyPart.slug == "back" ? "0.6"
                                    :
                                    bodyPart.slug == "left-arm(back)" ? "0.6"
                                    :
                                    bodyPart.slug == "right-arm(back)" ? "0.6"
                                    :
                                    bodyPart.slug == "gluteal" ? "1"
                                    :
                                    bodyPart.slug == "right-palm" ? "1.3"
                                    :
                                    bodyPart.slug == "left-palm" ? "1.3"
                                    :
                                    bodyPart.slug == "left-leg(back)" ? "0.37"
                                    :
                                    bodyPart.slug == "right-leg(back)" ? "0.37"
                                    :
                                    bodyPart.slug == "left-feet(back)" ? "1.2"
                                    :
                                    bodyPart.slug == "right-feet(back)" ? "1.2"
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
                                    //BACK
                                    bodyPart.slug == "head(back)" ? "0.8"
                                    :
                                    bodyPart.slug == "back" ? "0.6"
                                    :
                                    bodyPart.slug == "left-arm(back)" ? "0.6"
                                    :
                                    bodyPart.slug == "right-arm(back)" ? "0.6"
                                    :
                                    bodyPart.slug == "gluteal" ? "1"
                                    :
                                    bodyPart.slug == "right-palm" ? "1.3"
                                    :
                                    bodyPart.slug == "left-palm" ? "1.3"
                                    :
                                    bodyPart.slug == "left-leg(back)" ? "0.37"
                                    :
                                    bodyPart.slug == "right-leg(back)" ? "0.37"
                                    :
                                    bodyPart.slug == "left-feet(back)" ? "1.2"
                                    :
                                    bodyPart.slug == "right-feet(back)" ? "1.2"
                                    :
                                    null)
                            }
                            
                        />
                ))}
    
                <Circle cx={redDotLocation.x} cy={redDotLocation.y} r="5" fill="red" />
                {currentSlugMemory.map((data) =>
                    highlighted != data.id ?
                    <>
                        <Circle cx={data.location.x} cy={data.location.y} r="5" fill="black" />
                        <Text fill="black" x={data.location.x+5}  y={data.location.y-5}>{data.id}</Text>
                    </>
                    :
                    <>
                        <Circle cx={data.location.x} cy={data.location.y} r="5" fill="red" />
                        <Text fill="red" x={data.location.x+5}  y={data.location.y-5}>{data.id}</Text>
                    </>
                )}
            
        </Svg>
    )
}