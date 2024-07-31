import { keys_types } from "../types";



export const preprocessWeatherData = ({
  wData,
  keys
}: {
  wData: any,
  keys: string[]
}): Record<keys_types, any> => {
  
  const sorted = keys.reduce((acc, key) => {
    if (key in wData.daily[0]) {
      acc[key as keys_types] = wData.daily[0][key];
    }
    return acc;
  }, {} as Record<keys_types, any>);

  return sorted;
};
