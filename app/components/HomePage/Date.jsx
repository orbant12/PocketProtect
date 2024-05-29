import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment'

const Date = ({ date, onSelectDate, selected,today,affectedDays }) => {

  const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? moment(date).format('dd'):moment(date).format('dd')
  const dayNumber = moment(date).format('D')
  const fullDate = moment(date).format('YYYY-MM-DD')
  const isAffected = affectedDays.includes(fullDate);
  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[styles.card, selected === fullDate ? { backgroundColor: "magenta",borderRadius: 6, } : today == fullDate ? {backgroundColor:"#ffb3ff"} : !isAffected ? {backgroundColor:"black"} :{backgroundColor:"red"}  ]}
    >
      <Text
        style={[styles.big, selected === fullDate ? { color: "#fff" , fontSize:13 }: today == fullDate ? {fontSize:13} : {fontSize: 15}]}
      >
        {today != fullDate ? day:"Today"}
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
    color:"white"
  },
  medium: {
    fontSize: 13,
    color:"white"
  },
})