import { Timestamp } from "firebase/firestore";




export const timestampToString = (timestamp: any) => {
    //YYYY-MM-DD
    const date = new Date(timestamp.toDate())
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}.${month}.${day}`
}


export const timestampBirtDate_Age_Calculator_FromToday = (timestamp: any) => {
    //YYYY-MM-DD
    const date = new Date(timestamp.toDate())
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const today = new Date()
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth() + 1
    const todayDay = today.getDate()

    const age = todayYear - year

    return `${age}`
}

export const timestamp_DaysAgo_Calculator = (timestamp: any) => {
    //YYYY-MM-DD
    const date = new Date(timestamp.toDate())
    const today = new Date()
    const difference = today.getTime() - date.getTime()
    const days = difference / (1000 * 3600 * 24)
    return Math.floor(days)
}