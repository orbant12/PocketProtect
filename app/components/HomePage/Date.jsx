import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment'

const Date = ({ date, onSelectDate, selected }) => {

  const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? moment(date).format('dd'):moment(date).format('dd')
  const dayNumber = moment(date).format('D')
  const fullDate = moment(date).format('YYYY-MM-DD')
  
  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[styles.card, selected === fullDate && { backgroundColor: "#6146c6",borderRadius: 6, }]}
    >
      <Text
        style={[styles.big, selected === fullDate && { color: "#fff" }]}
      >
        {day}
      </Text>
      <View style={{ height: 10 }} />
      <Text
        style={[
          styles.medium,
          selected === fullDate && { color: "#fff", fontWeight: 'bold', fontSize: 15 },
        ]}
      >
        {dayNumber}
      </Text>
    </TouchableOpacity>
  )
}

export default Date

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eee',
    borderRadius: 5,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    height: 70,
    width: 60,
    marginHorizontal: 5,
  },
  big: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  medium: {
    fontSize: 13,
  },
})