import { useStripe } from "@stripe/stripe-react-native";
import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { handleSuccesfullPayment } from "../../services/server";
import { Success_Purchase_Client_Checkout_Data } from "../../utils/types";

export default function CheckoutScreen({
    checkOutData,
    price,
    navigation
}:
{
    checkOutData:Success_Purchase_Client_Checkout_Data;
    price:number;
    navigation:any;
}) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const API_URL = "http://localhost:3001/payment/intents";

    const handleSuccesfullSession = async (checkOutData:Success_Purchase_Client_Checkout_Data) => {
        try{
            console.log(checkOutData)
            await handleProdutctData(checkOutData)
            await SuccessPage_Modal()
            navigation.navigate("Assistant")
        } catch(ERR) {
            console.log(ERR)
        }
    }
    const handleProdutctData = async (checkOutData:Success_Purchase_Client_Checkout_Data) => {
        try {
            const response = await handleSuccesfullPayment({
                checkOutData,
                session_UID:checkOutData.id
            });
            if (response === true) {
                
            }
        } catch (error) {
            console.error("Error handling product data:", error);
        }
    };
    

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: Math.floor(price * 100) }), // Convert body to JSON string
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
                Alert.alert('Something went wron', paymentSheetError.message);
                return;
            }
        } catch (error) {
            Alert.alert('Something went wrng', error.message);
        }
    };
    
    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            handleSuccesfullSession(checkOutData)
        }
    };

    const SuccessPage_Modal = async () => {
        //USER OK BUTTON FEEDBACK
        return new Promise((resolve, reject) => {
            Alert.alert(
                "Success",
                "Your order is confirmed!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            resolve(true)
                        }
                    }
                ]
            )
        })
        
    }

    useEffect(() => {
        fetchPaymentSheetParams();
    }, []);

    return (
    <TouchableOpacity onPress={() => handleSuccesfullSession(checkOutData)} style={{width:"85%",padding:14,backgroundColor:"magenta",alignItems:"center",justifyContent:"center",borderRadius:10,marginBottom:30,marginTop:0}}>
        <Text style={{fontSize:15,fontWeight:"700", color:"white"}}>Purchase {checkOutData.assistantData.email}</Text>
    </TouchableOpacity>
    );
}

//openPaymentSheet
