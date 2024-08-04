import { FactScreenType_2 } from "../../../../components/Common/FactScreenComponents/factScreenType2";


export function FirstScreen({setProgress,progress}){
    return(
        <FactScreenType_2 
            title={"Why add your blood work ?"}
            descriptionRows={[
                {
                    icon_name:"magnify-scan",
                    icon_size:20,
                    text:"You will be able to scan your moles and get instant analasis by AI."
                },
                {
                    icon_name:"creation",
                    icon_size:20,
                    text:"Keep your moles in an organised manner so you can store and find data about your moles."
                },
                {
                    icon_name:"doctor",
                    icon_size:20,
                    text:"Your suspicious moles can be analised by a professional dermatologist."
                },
                {
                    icon_name:"calendar-today",
                    icon_size:20,
                    text:"You'll be able to keep track of any evolvement with reminders for recommended updates."
                }
            ]}
            boxText={"This setup approximately takes over 5-10 minutes to complete. If you decide to quit the setup, you can continue where you left off."}
            buttonAction={{type:"next",actionData:{progress:progress,increment_value:0.1}}}
            setProgress={setProgress}

        />
    )
}