export const getUviIndexExposure = (uvi: number): string => {
    if (uvi >= 0 && uvi <= 2) {
        return "You can be outside safely, but it's always good to wear sunscreen as a precaution."; 
    } else if (uvi >= 3 && uvi <= 5) {
        return "Stay in the shade during midday hours and wear recommended sunscreen."; 
    } else if (uvi >= 6 && uvi <= 7) {
        return "Avoid prolonged exposure to sunlight. Seek shade and wear protective clothing."; 
    } else if (uvi >= 8 && uvi <= 10) {
        return "Try to stay indoors during this time. Use recommended sunscreen and wear a hat if you go outside."; 
    } else if (uvi >= 11) {
        return "Must avoid being outside at this time. If you must go out, seek shade and use strong sunscreen."; 
    } else {
        return "Invalid UV Index"; 
    }
};
