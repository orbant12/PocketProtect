import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import moment from 'moment'
import Date from './Date'

export const Calendar = ({ onSelectDate, selected, today, todayDate,affectedDays }) => {
        
    const [dates, setDates] = useState([])
    const [scrollPosition, setScrollPosition] = useState()
    const [currentMonth, setCurrentMonth] = useState()
    const [currentYear, setCurrentYear] = useState()
    const [notTouched, setNotTouched] = useState(true)

     // <=====> Get Accurate Callendar Date Informations <=====>


    const getDates = () => {
        const _dates = []
        for (let i = -5; i < 40; i++) {
        const date = moment().add(i, 'days')
        _dates.push(date)
        }
        setDates(_dates)
    }

    useEffect(() => {
        getDates()
    }, [])


    // <=====> Calculate the initial scroll position to center today's date <=====>

    useEffect(() => {
        if (notTouched) {
          const todayIndex = dates.findIndex(date => date.isSame(moment(), 'day'));
          const initialScrollX = todayIndex * 44; // Assuming each date is 80 pixels wide
          setScrollPosition(initialScrollX);
        }
      }, [dates, notTouched]);


    // <=====> Get Current Date Informations <=====>

    const getCurrentMonth = () => {
        const month = moment(dates[0]).add(scrollPosition / 60, 'days').format('MMMM')
        setCurrentMonth(month)
    }

    const getCurrentYear = () => {
        const year = moment(dates[0]).add(scrollPosition / 60, 'days').format('YYYY')
        setCurrentYear(year)
    }

    useEffect(() => {
        getCurrentMonth()
        getCurrentYear()
    }, [scrollPosition])

return (
<>
    <View style={styles.dateTitle}>
        { selected == today ? <Text style={styles.title}>Today •</Text> : null}
        <Text style={styles.title}>{currentMonth}</Text>
        <Text style={styles.title}>{currentYear}</Text>
    </View>
    <View style={styles.dateSection}>
        <View style={styles.scroll}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={(e) => {
                    if (notTouched) {
                        setScrollPosition(e.nativeEvent.contentOffset.x);
                        setNotTouched(false);
                    }
                }}
                contentOffset={{ x: scrollPosition, y: 0 }} 
            >
            {dates.map((date, index) => (
                <Date
                key={index}
                date={date}
                today={today}
                onSelectDate={onSelectDate}
                selected={selected}
                affectedDays={affectedDays}
                />
            ))}
            </ScrollView>
        </View>
    </View>
</>
)
}

export default Calendar

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateTitle: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'left',
        alignItems: 'left',
        marginLeft: 20,
    },
    title: {
        fontSize: 20,
        marginRight: 5,
        fontWeight: 'bold',
    },
    dateSection: {
        width: '100%',
        paddingTop:5,
    },
    scroll: {
        height: 100,
    },
})