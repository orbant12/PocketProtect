
export function generateNumericalUID(length) {
    if (length <= 0) {
        throw new Error("Length must be a positive integer.");
    }

    let uid = '';
    for (let i = 0; i < length; i++) {
        uid += Math.floor(Math.random() * 10).toString();
    }
    return uid;
}