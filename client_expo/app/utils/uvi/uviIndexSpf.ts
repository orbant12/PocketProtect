export const getUviIndexSpf = (uvi: number): string => {
    if (uvi >= 0 && uvi <= 2) {
        return "SPF 15"; // Low UV index
    } else if (uvi >= 3 && uvi <= 5) {
        return "SPF 30"; // Moderate UV index
    } else if (uvi >= 6 && uvi <= 7) {
        return "SPF 50"; // High UV index
    } else if (uvi >= 8) {
        return "SPF 50+"; // Very high to extreme UV index
    } else {
        return "Invalid UV Index"; // Error handling
    }
};
