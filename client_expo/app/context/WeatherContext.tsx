import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { getWeatherData} from '../services/server';
import { preprocessWeatherData } from '../utils/melanoma/weatherDataSort';
import { WeatherSortedResponse } from '../utils/types';



interface WeatherContextType {
    weatherData: WeatherSortedResponse | null;
    loading: boolean;
    error: string | null;
    locationPermissionGranted: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const useWeather = () => {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};

interface WeatherProviderProps {
    children: ReactNode;
    part: "current" | "minutely" | "hourly" | "daily";
}

const WeatherProvider = ({ children, part }: WeatherProviderProps) => {
    const [weatherData, setWeatherData] = useState<WeatherSortedResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean>(false);
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (lat === null || lon === null) return;

            setLoading(true);
            setError(null);
            try {
                console.log('Fetching weather data');
                // const response = await getWeatherData({ part, lat, lon });
                // if (response === null) {
                //     setWeatherData(null);
                //     return;
                // }
                const response = {
                    daily: [
                        {
                            dt: 0,
                            sunrise: 0,
                            sunset: 0,
                            temp: {
                                day: 0,
                                min: 0,
                                max: 0,
                                night: 0,
                                eve: 0,
                                morn: 0,
                            },
                            feels_like: {
                                day: 0,
                                night: 0,
                                eve: 0,
                                morn: 0,
                            },
                            pressure: 0,
                            humidity: 0,
                            dew_point: 0,
                            wind_speed: 0,
                            wind_deg: 0,
                            weather: [
                                {
                                    id: 0,
                                    main: "",
                                    description: "",
                                    icon: "",
                                },
                            ],
                            clouds: 0,
                            pop: 0,
                            uvi: 10.09,
                        },
                    ],
                };
                const result = await preprocessWeatherData({
                    keys:["uvi","temp","pressure","humidity","weather","clouds","pop"],
                    wData:response
                });
   
                
                setWeatherData(result); 
                console.log(result);
                console.log('Weather data fetched');
            } catch (err) {
                setError('Failed to fetch weather data');
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [part, lat, lon]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                setLocationPermissionGranted(false);
                setLoading(false);
                return;
            }

            setLocationPermissionGranted(true);
            let location = await Location.getCurrentPositionAsync({});
            setLat(location.coords.latitude);
            setLon(location.coords.longitude);
        })();
    }, []);

    return (
        <WeatherContext.Provider value={{ weatherData, loading, error, locationPermissionGranted }}>
            {children}
        </WeatherContext.Provider>
    );
};

export { WeatherProvider, useWeather };
