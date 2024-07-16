package main

import (
	"context"
	_ "image/jpeg"
	"log"
	"net/http"
	"sort"
	"time"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	firebase "firebase.google.com/go"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/paymentintent"
	"google.golang.org/api/option"
)

// Structs for payment, user data, and requests
type (
	IntentRequest struct {
		Amount int64 `json:"amount"`
	}

	IntentResponse struct {
		PaymentIntent string `json:"paymentIntent"`
	}

	UserDataRequest struct {
		UserID string `json:"userId"`
	}

	UserData struct {
		FullName   string    `json:"fullname"`
		Email      string    `json:"email"`
		ProfileUrl string    `json:"profileUrl"`
		Gender     string    `json:"gender"`
		BirthDate  time.Time `json:"birth_date"`
		ID         string    `json:"id"`
		UserSince  string    `json:"user_since"`
	}

	UpdateUserDataRequest struct {
		FieldNameToChange string      `json:"fieldNameToChange"`
		DataToChange      interface{} `json:"dataToChange"`
		UserID            string      `json:"userId"`
	}

	GetAllMelanomaDataRequest struct {
		Gender string `json:"gender"`
		UserID string `json:"userId"`
	}

	SpotData struct {
		MelanomaId  string `json:"melanomaId"`
		MelanomaDoc struct {
			Location struct {
				X float64 `json:"x"`
				Y float64 `json:"y"`
			} `json:"location"`
			Spot struct {
				Slug      string      `json:"slug"`
				PathArray interface{} `json:"pathArray"`
				Color     string      `json:"color"`
			} `json:"spot"`
		} `json:"melanomaDoc"`
		Risk               *float32  `json:"risk"`
		Gender             string    `json:"gender"`
		Storage_Name       string    `json:"storage_name"`
		Storage_Location   string    `json:"storage_location"`
		MelanomaPictureUrl string    `json:"melanomaPictureUrl"`
		Created_At         time.Time `json:"created_at"`
	}

	SpotUploadRequest struct {
		SpotData     SpotData `json:"spotData"`
		UserId       string   `json:"userId"`
		MelanomaBlob []byte   `json:"melanomaBlob"`
	}

	GetSpecialMelanomaDataRequest struct {
		UserID string `json:"userId"`
	}

	SpecialMelanomaData struct {
		Outdated   []SpotData `json:"outdated"`
		Risky      []SpotData `json:"risky"`
		Unfinished []SpotData `json:"unfinished"`
	}

	UpdateMelanomaRiskRequest struct {
		UserId string  `json:"userId"`
		SpotId string  `json:"spotId"`
		Risk   float32 `json:"risk"`
	}
	UpdateMelanomaDataRequest struct {
		UserId       string   `json:"userId"`
		SpotId       string   `json:"spotId"`
		NewSpotData  SpotData `json:"newData"`
		MelanomaBlob []byte   `json:"melanomaBlob"`
	}

	ForceDeleteMoleRequest struct {
		UserId string `json:"userId"`
		SpotId string `json:"spotId"`
	}

	DeleteMoleResponse struct {
		Firestore struct {
			Success bool   `json:"success"`
			Message string `json:"message"`
		} `json:"firestore"`
		Storage struct {
			Success bool   `json:"success"`
			Message string `json:"message"`
		} `json:"storage"`
	}

	DeleteMoleRequest struct {
		UserId      string `json:"userId"`
		SpotId      string `json:"spotId"`
		DeleteType  string `json:"deleteType"`
		StorageName string `json:"storage_name"`
	}

	UIDCheckMelanomaRequest struct {
		PendingUID string `json:"pendingUID"`
		UserId     string `json:"userId"`
	}

	UIDCheckMelanomaResponse struct {
		CheckResult bool `json:"checkResult"`
	}

	MelanomaMetaDataRequest struct {
		UserId   string `json:"userId"`
		MetaData struct {
			Sunburn []struct {
				Stage int    `json:"stage"`
				Slug  string `json:"slug"`
			} `json:"sunburn"`
			SkinType         string `json:"skin_type"`
			DetectedRelative string `json:"detected_relative"`
		}
	}
)

func main() {
	e := echo.New()

	// Middleware setup
	setupMiddleware(e)

	// Routes setup
	setupRoutes(e)

	//fmt.Println("TensorFlow version:", tf.Version())

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
	e.POST("/payment/intents", handlePaymentIntents)

	// Client routes
	setupClientRoutes(e, client)

	// Melanoma routes
	setupMelanomaRoutes(e, client, storageClient)

}

func handleRoot(c echo.Context) error {
	return c.HTML(http.StatusOK, "<h1>Hello World</h1>")
}

func setupFirebase() *firestore.Client {
	opt := option.WithCredentialsFile("../serverTs/keys/serviceAccountKey.json")
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
	opt := option.WithCredentialsFile("../serverTs/keys/serviceAccountKey.json")
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

func handlePaymentIntents(c echo.Context) error {
	var req IntentRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(req.Amount),
		Currency: stripe.String("eur"),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, IntentResponse{PaymentIntent: pi.ClientSecret})
}

func setupClientRoutes(e *echo.Echo, client *firestore.Client) {
	// Client routes
	e.POST("/client/get/user-data", func(c echo.Context) error {
		var req UserDataRequest
		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		//FIRST UPLOAD THE IMAGE TO FIREBASE STORAGE

		doc, err := client.Collection("users").Doc(req.UserID).Get(context.Background())
		if err != nil {
			log.Printf("Error getting user document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var userData UserData
		if err := doc.DataTo(&userData); err != nil {
			log.Printf("Error converting document to UserData: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, userData)
	})

}

func setupMelanomaRoutes(e *echo.Echo, client *firestore.Client, storageClient *storage.Client) {
	// Melanoma routes
	e.POST("/client/get/all-melanoma", func(c echo.Context) error {
		var req GetAllMelanomaDataRequest
		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		docs, err := client.Collection("users").Doc(req.UserID).Collection("Melanoma").Documents(context.Background()).GetAll()

		var AllMelanomaData []SpotData
		for _, doc := range docs {
			var spotData SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
			AllMelanomaData = append(AllMelanomaData, spotData)
		}

		if err != nil {
			log.Printf("Error getting melanoma documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, AllMelanomaData)

	})

	e.POST("/client/upload/melanoma", func(c echo.Context) error {
		var req SpotUploadRequest
		var bucketName = "pocketprotect-cc462.appspot.com"

		// Bind request body to SpotUploadRequest struct
		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		log.Printf("MelanomaBlob length: %d", len(req.MelanomaBlob))
		// Upload image to Google Cloud Storage (GCS)
		ctx := context.Background()
		bucket := storageClient.Bucket(bucketName) // Remove "gs://" prefix
		obj := bucket.Object(req.SpotData.Storage_Location)
		//PERMISSION PUBLIC
		w := obj.NewWriter(ctx)
		_, err := w.Write(req.MelanomaBlob)
		if err != nil {
			log.Fatalf("Failed to write to storage: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to write to storage"})
		}
		if err := w.Close(); err != nil {
			log.Fatalf("Failed to close writer: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to close writer"})
		}

		// Set object ACL to publicRead
		if err := obj.ACL().Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
			log.Fatalf("Failed to set object ACL: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to set object ACL"})
		}

		attrs, err := obj.Attrs(ctx)
		if err != nil {
			log.Fatalf("Failed to get object attributes: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to get object attributes"})
		}

		downloadURL := attrs.MediaLink
		req.SpotData.MelanomaPictureUrl = downloadURL

		spotData := map[string]interface{}{
			"melanomaId": req.SpotData.MelanomaId,
			"melanomaDoc": map[string]interface{}{
				"location": map[string]float64{
					"x": req.SpotData.MelanomaDoc.Location.X,
					"y": req.SpotData.MelanomaDoc.Location.Y,
				},
				"spot": map[string]interface{}{
					"slug":      req.SpotData.MelanomaDoc.Spot.Slug,
					"pathArray": req.SpotData.MelanomaDoc.Spot.PathArray,
					"color":     req.SpotData.MelanomaDoc.Spot.Color,
				},
			},
			"risk":               req.SpotData.Risk,
			"gender":             req.SpotData.Gender,
			"storage_name":       req.SpotData.Storage_Name,
			"storage_location":   req.SpotData.Storage_Location,
			"melanomaPictureUrl": req.SpotData.MelanomaPictureUrl,
			"created_at":         req.SpotData.Created_At,
		}

		// Update Firestore with SpotData
		_, err = client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotData.MelanomaId).Set(ctx, spotData)
		if err != nil {
			log.Printf("Error uploading melanoma data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	})

	e.POST("/client/get/special-moles", func(c echo.Context) error {
		var req GetSpecialMelanomaDataRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		docs, err := client.Collection("users").Doc(req.UserID).Collection("Melanoma").Documents(context.Background()).GetAll()

		//Initial value so there is no nil in response

		SpecialMelanomaData := SpecialMelanomaData{
			Outdated:   []SpotData{},
			Risky:      []SpotData{},
			Unfinished: []SpotData{},
		}

		for _, doc := range docs {
			var spotData SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			if spotData.Risk != nil {

				if *spotData.Risk >= 0.5 {
					SpecialMelanomaData.Risky = append(SpecialMelanomaData.Risky, spotData)
				}
			} else {
				SpecialMelanomaData.Unfinished = append(SpecialMelanomaData.Unfinished, spotData)
			}
			if spotData.Created_At.AddDate(0, 0, 182).Before(time.Now()) {
				SpecialMelanomaData.Outdated = append(SpecialMelanomaData.Outdated, spotData)
			}
		}
		if err != nil {
			log.Printf("Error getting melanoma documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, SpecialMelanomaData)
	})

	e.POST("/client/update/melanoma-risk", func(c echo.Context) error {
		var req UpdateMelanomaRiskRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		//UPDATE RISK ONLY CHANGE THE RISK VALUE
		_, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Set(context.Background(), map[string]interface{}{
			"risk": req.Risk,
		}, firestore.MergeAll)

		if err != nil {
			log.Printf("Error updating melanoma data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	})

	e.POST("/client/update/melanoma-data", func(c echo.Context) error {
		var req UpdateMelanomaDataRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Upload image to Google Cloud Storage (GCS)
		ctx := context.Background()
		bucket := storageClient.Bucket("pocketprotect-cc462.appspot.com") // Remove "gs://" prefix
		path := "users/" + req.UserId + "/melanomaImages/" + req.NewSpotData.Storage_Name
		obj := bucket.Object(path)
		w := obj.NewWriter(ctx)
		_, err := w.Write(req.MelanomaBlob)

		if err != nil {
			log.Fatalf("Failed to write to storage: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to write to storage"})
		}

		if err := w.Close(); err != nil {
			log.Fatalf("Failed to close writer: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to close writer"})
		}

		// Set object ACL to publicRead
		if err := obj.ACL().Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
			log.Fatalf("Failed to set object ACL: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to set object ACL"})
		}

		attrs, err := obj.Attrs(ctx)
		if err != nil {
			log.Fatalf("Failed to get object attributes: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to get object attributes"})
		}

		downloadURL := attrs.MediaLink
		req.NewSpotData.MelanomaPictureUrl = downloadURL

		// GET THE OLD DATA
		doc, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Get(context.Background())
		if err != nil {
			log.Printf("Error getting user document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var spotData SpotData
		if err := doc.DataTo(&spotData); err != nil {
			log.Printf("Error converting document to SpotData: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		// Update Firestore with SpotData
		_, err = client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Set(ctx, map[string]interface{}{
			"melanomaId": req.NewSpotData.MelanomaId,
			"melanomaDoc": map[string]interface{}{
				"location": map[string]float64{
					"x": req.NewSpotData.MelanomaDoc.Location.X,
					"y": req.NewSpotData.MelanomaDoc.Location.Y,
				},
				"spot": map[string]interface{}{
					"slug":      req.NewSpotData.MelanomaDoc.Spot.Slug,
					"pathArray": req.NewSpotData.MelanomaDoc.Spot.PathArray,
					"color":     req.NewSpotData.MelanomaDoc.Spot.Color,
				},
			},
			"risk":               req.NewSpotData.Risk,
			"melanomaPictureUrl": req.NewSpotData.MelanomaPictureUrl,
			"created_at":         req.NewSpotData.Created_At,
			"storage_name":       req.NewSpotData.Storage_Name,
			"storage_location":   req.NewSpotData.Storage_Location,
			"gender":             req.NewSpotData.Gender,
		}, firestore.MergeAll)
		if err != nil {
			log.Printf("Error uploading melanoma data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		// Save the old data to history with the old storage name as id
		_, err = client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Collection("History").Doc(spotData.Storage_Name).Set(ctx, map[string]interface{}{
			"melanomaId": spotData.MelanomaId,
			"melanomaDoc": map[string]interface{}{
				"location": map[string]float64{
					"x": spotData.MelanomaDoc.Location.X,
					"y": spotData.MelanomaDoc.Location.Y,
				},
				"spot": map[string]interface{}{
					"slug":      spotData.MelanomaDoc.Spot.Slug,
					"pathArray": spotData.MelanomaDoc.Spot.PathArray,
					"color":     spotData.MelanomaDoc.Spot.Color,
				},
			},
			"risk":               spotData.Risk,
			"melanomaPictureUrl": spotData.MelanomaPictureUrl,
			"created_at":         spotData.Created_At,
			"storage_name":       spotData.Storage_Name,
			"storage_location":   spotData.Storage_Location,
			"gender":             spotData.Gender,
		})
		if err != nil {
			log.Printf("Error uploading melanoma data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	})

	e.POST("client/force-delete/melanoma", func(c echo.Context) error {
		var req DeleteMoleRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Delete the spot data from Firestore
		_, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Delete(context.Background())
		if err != nil {
			log.Printf("Error deleting melanoma data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		// Delete the spot image from Storage
		bucket := storageClient.Bucket("pocketprotect-cc462.appspot.com")
		obj := bucket.Object(req.SpotId)
		if err := obj.Delete(context.Background()); err != nil {
			log.Printf("Error deleting melanoma image: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var response DeleteMoleResponse

		response.Firestore.Success = true
		response.Firestore.Message = "Successfully deleted mole from Firestore"

		response.Storage.Success = true
		response.Storage.Message = "Successfully deleted mole image from Storage"

		return c.JSON(http.StatusOK, response)
	})

	e.POST("client/delete/melanoma", func(c echo.Context) error {
		var req DeleteMoleRequest
		//req.DeleteType -- >"history" or "latest"

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Delete the spot data from Firestore
		if req.DeleteType == "history" {
			_, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Collection("History").Doc(req.StorageName).Delete(context.Background())
			if err != nil {
				log.Printf("Error deleting melanoma data: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
		} else if req.DeleteType == "latest" {
			// Get the latest history data
			historyDocs, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Collection("History").Documents(context.Background()).GetAll()
			if err != nil {
				log.Printf("Error getting history documents: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			// If there are no history documents, delete the spot data
			if len(historyDocs) == 0 {
				_, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Delete(context.Background())
				if err != nil {
					log.Printf("Error deleting melanoma data: %v", err)
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}
			} else {
				var latestHistoryData SpotData
				latestHistoryData.Created_At = time.Time{}
				for _, doc := range historyDocs {
					var historyData SpotData
					if err := doc.DataTo(&historyData); err != nil {
						log.Printf("Error converting document to SpotData: %v", err)
						return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
					}
					if historyData.Created_At.After(latestHistoryData.Created_At) {
						latestHistoryData = historyData
					}
				}

				// Update the spot data with the latest history data
				_, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Set(context.Background(), map[string]interface{}{
					"melanomaId": latestHistoryData.MelanomaId,
					"melanomaDoc": map[string]interface{}{
						"location": map[string]float64{
							"x": latestHistoryData.MelanomaDoc.Location.X,
							"y": latestHistoryData.MelanomaDoc.Location.Y,
						},
						"spot": map[string]interface{}{
							"slug":      latestHistoryData.MelanomaDoc.Spot.Slug,
							"pathArray": latestHistoryData.MelanomaDoc.Spot.PathArray,
							"color":     latestHistoryData.MelanomaDoc.Spot.Color,
						},
					},
					"risk":               latestHistoryData.Risk,
					"melanomaPictureUrl": latestHistoryData.MelanomaPictureUrl,
					"created_at":         latestHistoryData.Created_At,
					"storage_name":       latestHistoryData.Storage_Name,
					"storage_location":   latestHistoryData.Storage_Location,
					"gender":             latestHistoryData.Gender,
				}, firestore.MergeAll)

				if err != nil {
					log.Printf("Error updating melanoma data: %v", err)
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}

				// Delete the latest history data
				_, err = client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Collection("History").Doc(latestHistoryData.Storage_Name).Delete(context.Background())
				if err != nil {
					log.Printf("Error deleting latest history data: %v", err)
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}

				// Delete the spot data
				_, err = client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Delete(context.Background())
				if err != nil {
					log.Printf("Error deleting melanoma data: %v", err)
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}

			}
		}

		// Delete the spot image from Storage
		bucket := storageClient.Bucket("pocketprotect-cc462.appspot.com")
		obj := bucket.Object(req.StorageName)
		if err := obj.Delete(context.Background()); err != nil {
			log.Printf("Error deleting melanoma image: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var response DeleteMoleResponse

		response.Firestore.Success = true
		response.Firestore.Message = "Successfully deleted mole from Firestore"

		response.Storage.Success = true
		response.Storage.Message = "Successfully deleted mole image from Storage"

		return c.JSON(http.StatusOK, response)
	})

	e.POST("client/check-uid/melanoma", func(c echo.Context) error {
		var req UIDCheckMelanomaRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		docs, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Documents(context.Background()).GetAll()

		if err != nil {
			log.Printf("Error getting melanoma documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		for _, doc := range docs {
			var spotData SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			if spotData.MelanomaId == req.PendingUID {
				return c.JSON(http.StatusOK, UIDCheckMelanomaResponse{CheckResult: true})
			}
		}

		return c.JSON(http.StatusOK, UIDCheckMelanomaResponse{CheckResult: false})

	})

	e.POST("client/upload/melanoma-metadata", func(c echo.Context) error {
		var req MelanomaMetaDataRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Update Firestore with MelanomaMetaData and skin_data as doc id
		_, err := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("skin_data").Set(context.Background(), req.MetaData)

		if err != nil {
			log.Printf("Error uploading melanoma metadata: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	})

	e.POST("client/get/one-melanoma", func(c echo.Context) error {
		type GetOneMelanomaRequest struct {
			UserId string `json:"userId"`
			SpotId string `json:"spotId"`
		}

		var req GetOneMelanomaRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		doc, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Get(context.Background())
		if err != nil {
			log.Printf("Error getting melanoma document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var spotData SpotData
		if err := doc.DataTo(&spotData); err != nil {
			log.Printf("Error converting document to SpotData: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, spotData)
	})

	e.POST("client/get/melanoma-on-slug", func(c echo.Context) error {
		type GetMelanomaOnSlugRequest struct {
			UserId string `json:"userId"`
			Gender string `json:"gender"`
			Slug   string `json:"slug"`
		}

		var req GetMelanomaOnSlugRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		docs, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Documents(context.Background()).GetAll()

		var MelanomaOnSlugData []SpotData
		for _, doc := range docs {
			var spotData SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
			if spotData.MelanomaDoc.Spot.Slug == req.Slug {
				MelanomaOnSlugData = append(MelanomaOnSlugData, spotData)
			}
		}

		if err != nil {
			log.Printf("Error getting melanoma documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, MelanomaOnSlugData)

	})

	e.POST("client/get/melanoma-history", func(c echo.Context) error {
		type GetMelanomaHistoryRequest struct {
			UserId string `json:"userId"`
			SpotId string `json:"spotId"`
		}

		var req GetMelanomaHistoryRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		docs, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Collection("History").Documents(context.Background()).GetAll()

		var MelanomaHistoryData []SpotData
		for _, doc := range docs {
			var spotData SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
			MelanomaHistoryData = append(MelanomaHistoryData, spotData)
		}

		//SORT INTO DESCENDING ORDER BY TIMESTAMP
		sort.Slice(MelanomaHistoryData, func(i, j int) bool {
			return MelanomaHistoryData[i].Created_At.After(MelanomaHistoryData[j].Created_At)
		})

		if err != nil {
			log.Printf("Error getting melanoma documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, MelanomaHistoryData)

	})

	e.POST("client/delete/melanoma-with-history-reset", func(c echo.Context) error {

		type DeleteMoleWithHistoryResetRequest struct {
			UserId string `json:"userId"`
			SpotId string `json:"spotId"`
			//DELETE TYPE : "history" or "latest
			DeleteType  string `json:"deleteType"`
			StorageName string `json:"storage_name"`
		}

		var req DeleteMoleWithHistoryResetRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Delete the spot data from Firestore
		if req.DeleteType == "history" {
			_, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Collection("History").Doc(req.StorageName).Delete(context.Background())
			if err != nil {
				log.Printf("Error deleting melanoma data: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
		} else if req.DeleteType == "latest" {
			// Get the latest history data
			historyDocs, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Collection("History").Documents(context.Background()).GetAll()
			if err != nil {
				log.Printf("Error getting history documents: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			// If there are no history documents, delete the spot data
			if len(historyDocs) == 0 {
				_, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Delete(context.Background())
				if err != nil {
					log.Printf("Error deleting melanoma data: %v", err)
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}
			} else {
				var latestHistoryData SpotData
				latestHistoryData.Created_At = time.Time{}
				for _, doc := range historyDocs {
					var historyData SpotData
					if err := doc.DataTo(&historyData); err != nil {
						log.Printf("Error converting document to SpotData: %v", err)
						return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
					}
					if historyData.Created_At.After(latestHistoryData.Created_At) {
						latestHistoryData = historyData
					}
				}

				// Update the spot data with the latest history data
				_, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Set(context.Background(), map[string]interface{}{
					"melanomaId": latestHistoryData.MelanomaId,
					"melanomaDoc": map[string]interface{}{
						"location": map[string]float64{
							"x": latestHistoryData.MelanomaDoc.Location.X,
							"y": latestHistoryData.MelanomaDoc.Location.Y,
						},
						"spot": map[string]interface{}{
							"slug":      latestHistoryData.MelanomaDoc.Spot.Slug,
							"pathArray": latestHistoryData.MelanomaDoc.Spot.PathArray,
							"color":     latestHistoryData.MelanomaDoc.Spot.Color,
						},
					},
					"risk":               latestHistoryData.Risk,
					"melanomaPictureUrl": latestHistoryData.MelanomaPictureUrl,
					"created_at":         latestHistoryData.Created_At,
					"storage_name":       latestHistoryData.Storage_Name,
					"storage_location":   latestHistoryData.Storage_Location,
					"gender":             latestHistoryData.Gender,
				}, firestore.MergeAll)

				if err != nil {
					log.Printf("Error updating melanoma data: %v", err)
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}

				// Delete the latest history data
				_, err = client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Collection("History").Doc(latestHistoryData.Storage_Name).Delete(context.Background())
				if err != nil {
					log.Printf("Error deleting latest history data: %v", err)
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}
			}
		}

		// Delete the spot image from Storage
		bucket := storageClient.Bucket("pocketprotect-cc462.appspot.com")
		path := "users/" + req.UserId + "/melanomaImages/" + req.StorageName
		obj := bucket.Object(path)
		if err := obj.Delete(context.Background()); err != nil {
			log.Printf("Error deleting melanoma image: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var response DeleteMoleResponse

		response.Firestore.Success = true
		response.Firestore.Message = "Successfully deleted mole from Firestore"

		response.Storage.Success = true
		response.Storage.Message = "Successfully deleted mole image from Storage"

		return c.JSON(http.StatusOK, response)
	})

	e.POST("client/get/number-of-melanoma", func(c echo.Context) error {
		type NumberOfMelanomaRequest struct {
			UserId string `json:"userId"`
			Gender string `json:"gender"`
		}

		var req NumberOfMelanomaRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Get the Melanoma data
		docs, error := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Documents(context.Background()).GetAll()

		if error != nil {
			log.Printf("Error getting melanoma documents: %v", error)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": error.Error()})
		}

		var melanomaDataCount int
		var beningDataCount int
		var malignantDataCount int
		var outdatedDataCount int

		for _, doc := range docs {
			var spotData SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			if spotData.Gender == req.Gender {
				melanomaDataCount++
			}

			if *spotData.Risk < 0.5 {
				beningDataCount++
			}

			if *spotData.Risk > 0.5 {
				malignantDataCount++
			}

			if spotData.Created_At.AddDate(0, 0, 186).Before(time.Now()) {
				outdatedDataCount++
			}

		}

		// Get the completed parts
		completedRef := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("skin_data")
		docSnap, err := completedRef.Get(context.Background())
		if err != nil {
			log.Printf("Error getting completed parts: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var completedParts int
		if docSnap.Exists() && docSnap.Data()["completedArray"] != nil {
			completedArray := docSnap.Data()["completedArray"].([]interface{})
			completedParts = len(completedArray)
		}

		if completedParts == 0 {
			return c.JSON(http.StatusOK, map[string]int{
				"all":       melanomaDataCount,
				"bening":    beningDataCount,
				"malignant": malignantDataCount,
				"outdated":  outdatedDataCount,
				"completed": 0,
			})
		} else {
			return c.JSON(http.StatusOK, map[string]int{
				"all":       melanomaDataCount,
				"bening":    beningDataCount,
				"malignant": malignantDataCount,
				"outdated":  outdatedDataCount,
				"completed": completedParts,
			})
		}
	})

}
