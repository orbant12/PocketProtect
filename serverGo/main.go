package main

import (
    "net/http"
    "os"

    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
    "github.com/stripe/stripe-go/v72"
    "github.com/stripe/stripe-go/v72/paymentintent"
)

func main() {
    // Initialize Echo instance
    e := echo.New()

    // Middleware
    e.Use(middleware.CORS())
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())

    // Serve a simple HTML response on the root route
    e.GET("/", func(c echo.Context) error {
        return c.HTML(http.StatusOK, "<h1>Hello World</h1>")
    })

    // Stripe payment intent route
    e.POST("/payment/intents", createPaymentIntent)

    // Start server
    port := os.Getenv("PORT")
    if port == "" {
        port = "3001"
    }
    e.Logger.Fatal(e.Start(":" + port))
}

// Payment request and response structs
type PaymentRequest struct {
    Amount int64 `json:"amount"`
}

type PaymentResponse struct {
    ClientSecret string `json:"paymentIntent"`
}

// Create payment intent handler
func createPaymentIntent(c echo.Context) error {
    stripe.Key = "sk_test_51PRx4QGWClPUuUnFeDPV9wcBBKVkIe7H6MtW8JRBBlX960cYqbC4UaXzP0f306dVwUFRDNwlvcPuII3EWIgxLuqt00jxMRo1F6"

    req := new(PaymentRequest)
    if err := c.Bind(req); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
    }

    params := &stripe.PaymentIntentParams{
        Amount:   stripe.Int64(req.Amount),
        Currency: stripe.String(string(stripe.CurrencyEUR)),
        PaymentMethodTypes: stripe.StringSlice([]string{
            "card",
        }),
    }

    pi, err := paymentintent.New(params)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }

    return c.JSON(http.StatusOK, PaymentResponse{ClientSecret: pi.ClientSecret})
}
