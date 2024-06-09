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