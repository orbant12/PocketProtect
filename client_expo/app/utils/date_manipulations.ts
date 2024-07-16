import moment from 'moment';


export type Timestamp = {seconds:number,nanoseconds:number}

export function parseDateToMidnight(dateStr:string) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0); 
} 

export function splitDate(date:string){
    const [year, month, day] = date.split('-').map(Number);
    return {year,month,day}
}

export function DateToString(date:Date | Timestamp){
    const format = moment(date).format('YYYY-MM-DD')
    return format
}


export function formatTimestampToString(timestamp: Timestamp | Date) {
    if (timestamp instanceof Date) {
        // If timestamp is a Date object, return ISO string
        return timestamp.toISOString();
    }

    // If timestamp is a Timestamp object
    const milliseconds = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000);
    const date = new Date(milliseconds);

    // Extract year, month, and day from the Date object
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');

    // Formatted date string in the format 'YYYY-MM-DD'
    const formattedDate = `${year}-${month}-${day}`;
    
    return formattedDate;
}


export function dateDistanceFromToday(date1:Timestamp | Date) {
    const d1 = new Date(DateToString(date1))
    const d2 = new Date(DateToString(new Date))
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return 180 - diffDays;
}

export function timeDistanceFromToday(timestamp:Date) {
    const now = new Date();
    const inputTime = new Date(DateToString(timestamp));
    const diffInMilliseconds = now.getTime() - inputTime.getTime();

    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInSeconds < 60) {
        return `${diffInSeconds} s`;
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} m`;
    } else {
        return `${diffInHours} h`;
    }
}