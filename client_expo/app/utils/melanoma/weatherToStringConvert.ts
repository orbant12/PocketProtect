import { WeatherSortedResponse } from "../types"

export const convertWeatherDataToString = (weatherData:WeatherSortedResponse) : string => {
    return `UV Index: ${weatherData.uvi}, Temp (Day): ${weatherData.temp.day}, Temp (MAX): ${weatherData.temp.max}, Temp (MIN): ${weatherData.temp.min}, Barometric Pressure: ${weatherData.pressure}, Humidity: ${weatherData.humidity}, Weather: ${weatherData.weather.main}, Percentage of cloud cover: ${weatherData.clouds}, Probability of precipitation: ${weatherData.pop}`
  }
  