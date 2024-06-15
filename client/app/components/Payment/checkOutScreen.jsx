import { useStripe } from "@stripe/stripe-react-native";
import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { handleSuccesfullPayment } from "../../services/server";

export default function CheckoutScreen(
    {checkOutData}
) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const API_URL = "http://localhost:3000/intents";

    const handleSuccesfullSession = async (checkOutData) => {
        try{
            handleProdutctData(checkOutData) 
        } catch(ERR) {
            console.log(ERR)
        }
    }
    const handleProdutctData = async (checkOutData) => {
        try {
            const response = await handleSuccesfullPayment({
                checkOutData
            });
            if (response === true) {
                setIsPaymentSessionPending(false);
            }
        } catch (error) {
            console.error("Error handling product data:", error);
            // Handle the error appropriately
        }
    };
    

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: Math.floor(5 * 100) }), // Convert body to JSON string
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            const { error: paymentSheetError } = await initPaymentSheet({
                merchantDisplayName: 'Example, Inc.',
                paymentIntentClientSecret: data.paymentIntent,
                defaultBillingDetails: {
                    name: 'Jane Doe',
                },
            });
    
            if (paymentSheetError) {
                Alert.alert('Something went wrong', paymentSheetError.message);
                return;
            }
        } catch (error) {
            Alert.alert('Something went wrong', error.message);
        }
    };
    
    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            handleSuccesfullSession()
        }
    };

    useEffect(() => {
        fetchPaymentSheetParams();
    }, []);

    return (
    <TouchableOpacity onPress={() => openPaymentSheet()} style={{width:"85%",padding:14,backgroundColor:"magenta",alignItems:"center",justifyContent:"center",borderRadius:10,marginBottom:30,marginTop:0}}>
        <Text style={{fontSize:"15",fontWeight:"700", color:"white"}}>Purchase</Text>
    </TouchableOpacity>
    );
}
