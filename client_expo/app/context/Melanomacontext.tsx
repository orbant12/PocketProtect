import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './UserAuthContext';
import { Melanoma } from '../models/Melanoma';



interface MelanomaContextType {
    melanoma: Object;
}

const MelanomaContext = createContext<MelanomaContextType | undefined>(undefined);

const useMelanoma = () => {
    const context = useContext(MelanomaContext);
    if (context === undefined) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};



const MelanomaProvider = ({ children }:{children:ReactNode}) => {




    return (
        <MelanomaContext.Provider value={{ melanoma, handleSetup }}>
            {children}
        </MelanomaContext.Provider>
    );
};

export { MelanomaProvider, useMelanoma };
