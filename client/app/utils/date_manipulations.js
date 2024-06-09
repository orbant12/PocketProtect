import moment from 'moment';

export function parseDateToMidnight(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0); 
} 

export function splitDate(date){
    const [year, month, day] = date.split('-').map(Number);
    return {year,month,day}
}

export function DateToString(date){
    const format = moment(date).format('YYYY-MM-DD')
    return format
}

export function formatTimestampToString(timestamp) {        
    const milliseconds = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000);    
    const date = new Date(milliseconds);    
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const day = String(date.getUTCDate()).padStart(2, '0'); 
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

export function dateDistanceFromToday(date1) {
    const d1 = new Date(formatTimestampToString(date1))
    const d2 = DateToString(new Date)
    const diffTime = d1 - d2;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 186;
}