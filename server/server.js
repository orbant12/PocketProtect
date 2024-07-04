"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});
// <======> STRIPE PAYMENT <======> 
const payment = "/payment";
// <======> ENDPOINTS <======> 
app.post(`${payment}/intents`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.json({ paymentIntent: paymentIntent.client_secret });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
}));
// <======> MELANOMA <======> 
const melanoma = "/melanoma";
