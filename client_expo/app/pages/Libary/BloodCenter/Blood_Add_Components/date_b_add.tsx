import { Text } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

export function DateInput({
    creationDate,
    setCreationDate

}){ 
    const onDateChange = (even:any, date:Date) => {
        setCreationDate(String(date))
    };

    return(
        <>          
        <DateTimePicker onChange={(e,d) => onDateChange(e,d)} value={new Date(creationDate)} mode="date" style={{marginTop:0}} />
        {creationDate == "2001-08-25T23:15:00.000Z" ?
        <Text style={{fontWeight:"600"}}>Last Updated: <Text style={{opacity:0.4}}>First Time</Text></Text>
        :
        <Text style={{fontWeight:"600"}}>Last Updated:<Text style={{opacity:0.4}}>{creationDate}</Text></Text>
        }
        </>
    )
}