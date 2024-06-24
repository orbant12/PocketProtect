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

export function DateToString(date:Date){
    const format = moment(date).format('YYYY-MM-DD')
    return format
}


export function formatTimestampToString(timestamp:Timestamp) {        
    const milliseconds = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000);    
    const date = new Date(milliseconds);    
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const day = String(date.getUTCDate()).padStart(2, '0'); 
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

export function dateDistanceFromToday(date1:Timestamp) {
    const d1 = new Date(formatTimestampToString(date1))
    const d2 = new Date
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export function timeDistanceFromToday(timestamp:Timestamp) {
    const { seconds, nanoseconds } = timestamp;
    const milliseconds = seconds * 1000 + Math.round(nanoseconds / 1000000);

    const now = new Date();
    const inputTime = new Date(milliseconds);
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