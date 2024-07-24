package main

import (
	"context"
	_ "image/jpeg"
	"log"
	routes "my-go-project/routes"
	"net/http"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	firebase "firebase.google.com/go"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/stripe/stripe-go/v72"
	"google.golang.org/api/option"
)

func main() {
	e := echo.New()

	// Middleware setup
	setupMiddleware(e)

	// Routes setup
	setupRoutes(e)

	// Start server
	e.Logger.Fatal(e.Start(":3001"))
}

func setupMiddleware(e *echo.Echo) {
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
}

func setupRoutes(e *echo.Echo) {
	// Root route
	e.GET("/", handleRoot)

	// Firebase setup
	client := setupFirebase()

	// Storage setup
	storageClient := setupStorageClient()

	// Stripe setup
	setupStripe()

	// Payment intents
	e.POST("/payment/intents", routes.HandlePaymentIntents)

	// Client routes
	routes.SetupClientRoutes(e, client, storageClient)

	// Melanoma routes
	routes.SetupMelanomaRoutes(e, client, storageClient)

	// Diagnosis routes
	routes.SetupDiagnosisRoutes(e, client)

	// Blood routes
	routes.SetupBloodRoutes(e, client)

	// PAYMENT ROUTES
	routes.SetupPaymentRoutes(e, client)

	// Assistant routes
	routes.SetupAssistantRoutes(e, client)
}

func handleRoot(c echo.Context) error {
	return c.HTML(http.StatusOK, "<h1>Hello World</h1>")
}

func setupFirebase() *firestore.Client {
	opt := option.WithCredentialsFile("serviceAccountKey.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatal(err)
	}
	client, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	return client
}

func setupStorageClient() *storage.Client {
	opt := option.WithCredentialsFile("serviceAccountKey.json")
	ctx := context.Background()
	client, err := storage.NewClient(ctx, opt)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	return client
}

func setupStripe() {
	stripe.Key = "sk_test_51PRx4QGWClPUuUnFeDPV9wcBBKVkIe7H6MtW8JRBBlX960cYqbC4UaXzP0f306dVwUFRDNwlvcPuII3EWIgxLuqt00jxMRo1F6"
}
