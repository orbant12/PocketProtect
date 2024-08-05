export const getUviIndexSunscreen = (uvi: number): string => {
    if (uvi >= 0 && uvi <= 2) {
        return "Sunscreen is not necessary for short periods of time. However, if you'll be outside for extended periods, consider applying some sunscreen";
    } else if (uvi >= 3 && uvi <= 5) {
        return "Apply a broad-spectrum sunscreen with at least SPF 30 every 2 hours.";
    } else if (uvi >= 6 && uvi <= 7) {
        return "Apply a broad-spectrum sunscreen with at least SPF 30, if possible 50, generously and frequently, every 2 hours.";
    } else if (uvi >= 8 && uvi <= 10) {
        return "Apply a broad-spectrum sunscreen with at least SPF 50+ every 2 hours and immediately after swimming or sweating.";
    } else if (uvi >= 11) {
        return "Apply a broad-spectrum sunscreen with at least SPF 50+ liberally and frequently.";
    } else {
        return "Invalid UV Index";
    }
};
