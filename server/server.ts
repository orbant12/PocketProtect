const express = require('express');
const stripe = require('stripe')("sk_test_51PRx4QGWClPUuUnFeDPV9wcBBKVkIe7H6MtW8JRBBlX960cYqbC4UaXzP0f306dVwUFRDNwlvcPuII3EWIgxLuqt00jxMRo1F6");
const cors = require('cors');
var admin = require("firebase-admin");
var serviceAccount = require("./keys/serviceAccountKey.json");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


//TEST FROM BROWSER TO RESPOND AS h1

app.get('/', (req:any, res:any) => {
    res.send('<h1>Hello World</h1>');
}
);


// <======> STRIPE PAYMENT <======> 

    const payment = "/payment"

    type IntentRequest = {
        body: {
            amount: number;
        }
    }

    type IntentResponse = {
        json: (arg0: { paymentIntent: string; }) => void;
        status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: any; }): void; new(): any; }; };
    }
    
    // <======> ENDPOINTS <======> 

    app.post(`${payment}/intents`, async (req:IntentRequest, res:IntentResponse) => {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: req.body.amount,
                currency: 'eur',
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            res.json({ paymentIntent: paymentIntent.client_secret });
        } catch (e:any) {
            res.status(400).json({ error: e.message });
        }
    });


// <======> MELANOMA <======> 

    const melanoma = "/melanoma"

    