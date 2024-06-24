import React, { memo, useCallback } from "react";
import { Path } from '/Users/tamas/Programming Projects/DetectionApp/client/node_modules/react-native-body-highlighter/node_modules/react-native-svg';
import differenceWith from "ramda/src/differenceWith";

import { bodyFront } from "./bodyFront";
import { bodyBack } from "./bodyBack";
import { SvgMaleWrapper } from "./SvgMaleWrapper";
import { bodyFemaleFront } from "./bodyFemaleFront";
import { bodyFemaleBack } from "./bodyFemaleBack";
import { SvgFemaleWrapper } from "./SvgFemaleWrapper";

export type Slug =
  | "abs"
  | "head"
  | "left-arm"
  | "right-arm"
  | "chest"
  | "upper-leg-right"
  | "upper-leg-left"
  | "lower-leg-right"
  | "lower-leg-left"
  | "left-feet"
  | "right-feet"
  | "right-hand"
  | "left-hand"
  | "back"
  | "head(back)"
  | "left-arm(back)"
  | "right-arm(back)"
  | "left-leg(back)"
  | "right-leg(back)"
  | "left-feet(back)"
  | "right-feet(back)"
  | "right-palm"
  | "left-palm"
  | "gluteal";


export interface BodyPart {
  intensity?: number;
  color: string;
  slug: Slug;
  pathArray?: string[];
}

type Props = {
  colors: ReadonlyArray<string>;
  data: ReadonlyArray<BodyPart>;
  scale: number;
  frontOnly?: boolean;
  backOnly?: boolean;
  side: "front" | "back";
  gender?: "male" | "female";
  onBodyPartPress: (b: BodyPart) => void;
};

const comparison = (a: BodyPart, b: BodyPart) => a.slug === b.slug;

const Body = ({
  colors,
  data,
  scale,
  side,
  gender = "male",
  onBodyPartPress,
}: Props) => {
  const mergedBodyParts = useCallback(
    (dataSource: ReadonlyArray<BodyPart>) => {
      const innerData = data
        .map((d) => {
          return dataSource.find((t) => t.slug === d.slug);
        })
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
    if (bodyPart.intensity) color = colors[bodyPart.intensity];
    else color = bodyPart.color;
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
    return renderBodySvg(side === "front" ? bodyFemaleFront : bodyFemaleBack);
  }

  return renderBodySvg(side === "front" ? bodyFront : bodyBack);
};

Body.default = {
  scale: 1,
  colors: ["#0984e3", "#74b9ff"],
  zoomOnPress: false,
  side: "front",
};

export default memo(Body);
