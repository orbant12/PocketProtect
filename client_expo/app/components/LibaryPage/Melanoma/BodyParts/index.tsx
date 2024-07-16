import React, { memo, useCallback } from "react";
import { Path } from 'react-native-body-highlighter/node_modules/react-native-svg';
import differenceWith from "ramda/src/differenceWith";

import { bodyFront } from "./bodyFront";
import { bodyBack } from "./bodyBack";
import { SvgMaleWrapper } from "./SvgMaleWrapper";
import { bodyFemaleFront } from "./bodyFemaleFront";
import { bodyFemaleBack } from "./bodyFemaleBack";
import { SvgFemaleWrapper } from "./SvgFemaleWrapper";
import { BodyPart, SkinType } from "../../../../utils/types";
import { SkinNumber_Convert } from "../../../../utils/skinConvert";




type Props = {
  colors?: ReadonlyArray<string>;
  data: ReadonlyArray<BodyPart>;
  scale: number;
  frontOnly?: boolean;
  backOnly?: boolean;
  side: "front" | "back";
  gender?: "male" | "female";
  onBodyPartPress: (b: BodyPart) => void;
  skinColor: SkinType;
};

const comparison = (a: BodyPart, b: BodyPart) => a.slug === b.slug;

const Body = ({
  colors = ["#0984e3", "#74b9ff"], // Provide default colors
  data,
  scale,
  side,
  skinColor,
  gender = "male",
  onBodyPartPress,
}: Props) => {
  const mergedBodyParts = useCallback(
    (dataSource: ReadonlyArray<BodyPart>) => {
      const innerData = data
        .map((d) => dataSource.find((t) => t.slug === d.slug))
        .filter(Boolean);

      const coloredBodyParts = innerData.map((d) => {
        const bodyPart = data.find((e) => e.slug === d?.slug);
        let colorIntensity = 1;
        if (bodyPart?.intensity) colorIntensity = bodyPart.intensity;
        return { ...d, color: colors[colorIntensity - 1] };
      });

      const formattedBodyParts = differenceWith(comparison, dataSource, data);    
      return [...formattedBodyParts, ...coloredBodyParts];
    },
    [data, colors]
  );

  const getColorToFill = (bodyPart: BodyPart) => {
    let color;
    if (bodyPart.intensity && colors[bodyPart.intensity - 1]) {
        color = colors[bodyPart.intensity - 1];
    } else {
        color = bodyPart.color;
    }

    // Fallback color if color is undefined or invalid
    if (!color) {
        color = '#000000'; // Default to black or any other fallback color
    }
    return color;
  };

  const renderBodySvg = (data: ReadonlyArray<BodyPart>) => {
    const SvgWrapper = gender === "male" ? SvgMaleWrapper : SvgFemaleWrapper;
    return (
      <SvgWrapper side={side} scale={scale}>
        {mergedBodyParts(data).map((bodyPart: BodyPart) => {
          if (bodyPart.pathArray) {
            return bodyPart.pathArray.map((path: string) => {
              return (
                <Path
                  key={path}
                  onPress={() => onBodyPartPress?.(bodyPart)}
                  id={bodyPart.slug}
                  fill={getColorToFill(bodyPart)}
                  d={path}
                />
              );
            });
          }
        })}
      </SvgWrapper>
    );
  };

  if (gender === "female") {
    return renderBodySvg(side === "front" ? bodyFemaleFront(SkinNumber_Convert(skinColor)) : bodyFemaleBack(SkinNumber_Convert(skinColor)));
  }

  return renderBodySvg(side === "front" ? bodyFront(SkinNumber_Convert(skinColor)) : bodyBack(SkinNumber_Convert(skinColor)));
};

Body.default = {
  scale: 1,
  colors: ["#0984e3", "#74b9ff"], // Move default colors here
  zoomOnPress: false,
  side: "front",
};

export default memo(Body);
