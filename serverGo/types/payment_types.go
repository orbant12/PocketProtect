package route_types

type (
	IntentRequest struct {
		Amount int64 `json:"amount"`
	}

	IntentResponse struct {
		PaymentIntent string `json:"paymentIntent"`
	}
)
