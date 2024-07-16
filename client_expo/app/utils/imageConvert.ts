

export const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
        // Fetch image data from URI
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        
        // Get blob from the response
        const blob = await response.blob();

        // Read blob as data URL and resolve with base64-encoded data
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result?.toString().split(',')[1] || '';
                resolve(base64data);
            };
            reader.onerror = () => {
                reject(new Error('Error reading image data'));
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw error;
    }
};