// main.rs

use rocket::{Rocket, Build};
use rocket::response::status::{BadRequest, Created};
use rocket::serde::json::Json;
use rocket::serde::Deserialize;
use serde_json::Value;
use reqwest::blocking::Client;

#[derive(Debug, Deserialize)]
struct IntentRequest {
    amount: i64,
}

#[derive(Debug, serde::Serialize)]
struct IntentResponse {
    paymentIntent: String,
}

#[post("/payment/intents", data = "<request>")]
async fn create_payment_intent(request: Json<IntentRequest>) -> Result<Json<IntentResponse>, BadRequest<&'static str>> {
    let client_secret = create_stripe_payment_intent(request.amount).await?;
    Ok(Json(IntentResponse {
        paymentIntent: client_secret,
    }))
}

async fn create_stripe_payment_intent(amount: i64) -> Result<String, BadRequest<&'static str>> {
    let stripe_secret_key = "sk_test_51PRx4QGWClPUuUnFeDPV9wcBBKVkIe7H6MtW8JRBBlX960cYqbC4UaXzP0f306dVwUFRDNwlvcPuII3EWIgxLuqt00jxMRo1F6";
    let client = Client::new();

    let payment_intent_params = json!({
        "amount": amount,
        "currency": "eur",
        "automatic_payment_methods": {
            "enabled": true
        }
    });

    let resp = client.post("https://api.stripe.com/v1/payment_intents")
        .basic_auth("", Some(stripe_secret_key))
        .json(&payment_intent_params)
        .send()
        .map_err(|_| BadRequest(Some("Failed to create payment intent")))?;

    let resp_json: Value = resp.json().map_err(|_| BadRequest(Some("Failed to parse response")))?;

    let client_secret = resp_json["client_secret"].as_str().ok_or(BadRequest(Some("Client secret not found")))?;

    Ok(client_secret.to_string())
}

#[get("/")]
fn index() -> &'static str {
    "<h1>Hello World</h1>"
}

#[launch]
fn rocket() -> Rocket<Build> {
    rocket::build()
        .mount("/", routes![index])
        .mount("/payment", routes![create_payment_intent])
}

