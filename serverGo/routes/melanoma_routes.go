package routes

import (
	"context"
	_ "image/jpeg"
	"log"
	route_types "my-go-project/types"
	"net/http"
	"sort"
	"time"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	"github.com/labstack/echo/v4"
)

func SetupMelanomaRoutes(e *echo.Echo, client *firestore.Client, storageClient *storage.Client) {
	// Melanoma routes
	e.POST("/client/get/all-melanoma", func(c echo.Context) error {
		var req route_types.GetAllMelanomaDataRequest
		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		docs, err := client.Collection("users").Doc(req.UserID).Collection("Melanoma").Documents(context.Background()).GetAll()

		var AllMelanomaData []route_types.SpotData
		for _, doc := range docs {
			var spotData route_types.SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
			if req.Gender == spotData.Gender {
				AllMelanomaData = append(AllMelanomaData, spotData)
			}
		}

		if err != nil {
			log.Printf("Error getting melanoma documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, AllMelanomaData)

	})

	e.POST("/client/upload/melanoma", func(c echo.Context) error {
		var req route_types.SpotUploadRequest
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
		var req route_types.GetSpecialMelanomaDataRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		docs, err := client.Collection("users").Doc(req.UserID).Collection("Melanoma").Documents(context.Background()).GetAll()

		//Initial value so there is no nil in response

		SpecialMelanomaData := route_types.SpecialMelanomaData{
			Outdated:   []route_types.SpotData{},
			Risky:      []route_types.SpotData{},
			Unfinished: []route_types.SpotData{},
		}

		for _, doc := range docs {
			var spotData route_types.SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
			if spotData.Gender == req.Gender {
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
		}
		if err != nil {
			log.Printf("Error getting melanoma documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, SpecialMelanomaData)
	})

	e.POST("/client/update/melanoma-risk", func(c echo.Context) error {
		var req route_types.UpdateMelanomaRiskRequest

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
		var req route_types.UpdateMelanomaDataRequest

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

		var spotData route_types.SpotData
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
		var req route_types.DeleteMoleRequest

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

		var response route_types.DeleteMoleResponse

		response.Firestore.Success = true
		response.Firestore.Message = "Successfully deleted mole from Firestore"

		response.Storage.Success = true
		response.Storage.Message = "Successfully deleted mole image from Storage"

		return c.JSON(http.StatusOK, response)
	})

	e.POST("client/delete/melanoma", func(c echo.Context) error {
		var req route_types.DeleteMoleRequest
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
				var latestHistoryData route_types.SpotData
				latestHistoryData.Created_At = time.Time{}
				for _, doc := range historyDocs {
					var historyData route_types.SpotData
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

		var response route_types.DeleteMoleResponse

		response.Firestore.Success = true
		response.Firestore.Message = "Successfully deleted mole from Firestore"

		response.Storage.Success = true
		response.Storage.Message = "Successfully deleted mole image from Storage"

		return c.JSON(http.StatusOK, response)
	})

	e.POST("client/check-uid/melanoma", func(c echo.Context) error {
		var req route_types.UIDCheckMelanomaRequest

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
			var spotData route_types.SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			if spotData.MelanomaId == req.PendingUID {
				return c.JSON(http.StatusOK, route_types.UIDCheckMelanomaResponse{CheckResult: true})
			}
		}

		return c.JSON(http.StatusOK, route_types.UIDCheckMelanomaResponse{CheckResult: false})

	})

	e.POST("client/upload/melanoma-metadata", func(c echo.Context) error {
		type MelanomaMetaDataRequest struct {
			UserId   string `json:"userId"`
			MetaData struct {
				Sunburn []struct {
					Stage int    `json:"stage"`
					Slug  string `json:"slug"`
				} `json:"sunburn"`
				SkinType         int    `json:"skin_type"`
				DetectedRelative string `json:"detected_relative"`
			} `json:"metaData"`
		}

		var req MelanomaMetaDataRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Fetch existing document data from Firestore
		docRef := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("skin_data")
		docSnapshot, err := docRef.Get(context.Background())
		if err != nil {
			log.Printf("Error fetching document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		// Merge existing data with new metaData
		var existingData map[string]interface{}
		if docSnapshot.Exists() {
			if err := docSnapshot.DataTo(&existingData); err != nil {
				log.Printf("Error converting document data: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
		} else {
			existingData = make(map[string]interface{})
		}

		// Update existingData with new metaData
		existingData["sunburn"] = req.MetaData.Sunburn
		existingData["skin_type"] = req.MetaData.SkinType
		existingData["detected_relative"] = req.MetaData.DetectedRelative

		// Perform the update operation in Firestore
		_, err = docRef.Set(context.Background(), existingData)
		if err != nil {
			log.Printf("Error updating document: %v", err)
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

		var spotData route_types.SpotData
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

		var MelanomaOnSlugData []route_types.SpotData
		for _, doc := range docs {
			var spotData route_types.SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
			if spotData.MelanomaDoc.Spot.Slug == req.Slug && spotData.Gender == req.Gender {
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

		var MelanomaHistoryData []route_types.SpotData
		for _, doc := range docs {
			var spotData route_types.SpotData
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
				var latestHistoryData route_types.SpotData
				latestHistoryData.Created_At = time.Time{}
				for _, doc := range historyDocs {
					var historyData route_types.SpotData
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

		var response route_types.DeleteMoleResponse

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
		docs, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Documents(context.Background()).GetAll()

		if err != nil {
			log.Printf("Error getting melanoma documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var melanomaDataCount int
		var beningDataCount int
		var malignantDataCount int
		var outdatedDataCount int

		for _, doc := range docs {
			var spotData route_types.SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			if spotData.Gender == req.Gender {
				melanomaDataCount++
			}

			if spotData.Risk != nil {
				if *spotData.Risk < 0.5 {
					beningDataCount++
				}

				if *spotData.Risk > 0.5 {
					malignantDataCount++
				}
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

	e.POST("client/get/number-of-melanoma-on-slug", func(c echo.Context) error {
		type NumberOfMelanomaOnSlugRequest struct {
			UserId string `json:"userId"`
			Gender string `json:"gender"`
		}

		var req NumberOfMelanomaOnSlugRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Get the Melanoma data
		docs, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Documents(context.Background()).GetAll()

		if err != nil {
			log.Printf("Error getting melanoma documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var slugValues []string
		for _, doc := range docs {
			var spotData route_types.SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			if spotData.MelanomaDoc.Spot.Slug != "" && spotData.Gender == req.Gender {
				slugValues = append(slugValues, spotData.MelanomaDoc.Spot.Slug)
			}
		}

		slugCount := make(map[string]int)
		for _, slug := range slugValues {

			slugCount[slug]++
		}

		return c.JSON(http.StatusOK, slugCount)
	})

	e.POST("client/update/completed-parts", func(c echo.Context) error {
		type CompletedArrayItem struct {
			Slug string `json:"slug"`
		}

		type UpdateCompletedPartsRequest struct {
			UserId         string               `json:"userId"`
			CompletedArray []CompletedArrayItem `json:"completedArray"`
		}

		var req UpdateCompletedPartsRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		// Prepare updates for Firestore
		var updates []firestore.Update
		var formattedCompletedArray []map[string]interface{}

		if len(req.CompletedArray) == 0 {
			updates = append(updates, firestore.Update{
				Path:  "completedArray",
				Value: req.CompletedArray,
			})
		} else {

			for _, item := range req.CompletedArray {
				data := map[string]interface{}{"slug": item.Slug}
				formattedCompletedArray = append(formattedCompletedArray, data)
			}

			updates = append(updates, firestore.Update{
				Path:  "completedArray",
				Value: formattedCompletedArray,
			})
		}
		// Update Firestore with MelanomaMetaData and skin_data as doc id
		_, err := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("skin_data").Update(context.Background(), updates)

		if err != nil {
			log.Printf("Error uploading melanoma metadata: %v", err)
			//SET DOCUMENTS
			if err.Error() == "rpc error: code = NotFound desc = no such document" {
				_, err := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("skin_data").Set(context.Background(), map[string]interface{}{
					"completedArray": formattedCompletedArray,
				}, firestore.MergeAll)

				if err != nil {
					log.Printf("Error uploading melanoma metadata: %v", err)
					return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				}
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	})

	e.POST("client/get/completed-parts", func(c echo.Context) error {
		type GetCompletedPartsRequest struct {
			UserId string `json:"userId"`
		}

		var req GetCompletedPartsRequest
		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		completedRef := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("skin_data")
		docSnap, err := completedRef.Get(context.Background())
		if err != nil {
			log.Printf("Error getting completed parts: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var completedParts []map[string]interface{}
		if docSnap.Exists() {
			completedArray := docSnap.Data()["completedArray"]
			if completedArray != nil {
				// Type assertion to []interface{}
				if arr, ok := completedArray.([]interface{}); ok {
					// Convert each item to map[string]interface{}
					for _, item := range arr {
						if m, ok := item.(map[string]interface{}); ok {
							completedParts = append(completedParts, m)
						} else {
							log.Printf("Unexpected type in completedArray: %T", item)
						}
					}
				} else {
					log.Printf("Unexpected type for completedArray: %T", completedArray)
				}
			}
		}

		return c.JSON(http.StatusOK, completedParts)
	})

	e.POST("/client/get/skin-type", func(c echo.Context) error {
		// Define a struct to represent the request payload
		type GetSkinTypeRequest struct {
			UserId string `json:"userId"`
		}

		// Parse request body into GetSkinTypeRequest struct
		var req GetSkinTypeRequest
		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Construct Firestore document reference
		skinTypeRef := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("skin_data")

		// Retrieve specific field ("skin_type") from Firestore document
		docSnap, err := skinTypeRef.Get(context.Background())
		if err != nil {
			log.Printf("Error getting skin type: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		// Check if the document exists
		if docSnap.Exists() {
			// Parse the skin type from Firestore document data
			var data map[string]interface{}
			if err := docSnap.DataTo(&data); err != nil {
				log.Printf("Error parsing skin type data: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			// Extract skin type from Firestore data
			skinTypeValue, ok := data["skin_type"]
			if !ok {
				log.Printf("Skin type field not found in Firestore document")
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Skin type field not found"})
			}

			// Convert Firestore's float64 to int
			var skinType int
			switch v := skinTypeValue.(type) {
			case int:
				skinType = v
			case int64:
				skinType = int(v)
			case float64:
				skinType = int(v) // Firestore returns numbers as float64
			default:
				log.Printf("Invalid skin type format in Firestore: %v", skinTypeValue)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid skin type format"})
			}

			// Return the skin type as JSON response
			return c.JSON(http.StatusOK, skinType)
		}

		// If document doesn't exist, return appropriate response
		log.Printf("No skin type document found for user %s", req.UserId)
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Skin type not found"})
	})

	e.POST("client/get/melanoma--by-id", func(c echo.Context) error {
		type GetMelanomaByIdRequest struct {
			UserId string `json:"userId"`
			MoleId string `json:"moleId"`
		}

		var req GetMelanomaByIdRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		doc, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.MoleId).Get(context.Background())

		if err != nil {
			log.Printf("Error getting melanoma document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		if doc.Exists() {
			var spotData route_types.SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			return c.JSON(http.StatusOK, spotData)
		} else {
			log.Printf("No such document!")
			return c.JSON(http.StatusNotFound, map[string]string{"error": "No such document!"})
		}
	})

	e.POST("client/change/melanoma-picture", func(c echo.Context) error {
		type ChangeMelanomaPictureRequest struct {
			UserId       string `json:"userId"`
			SpotId       string `json:"spotId"`
			MelanomaBlob []byte `json:"melanomaBlob"`
		}

		var req ChangeMelanomaPictureRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Get the spot data
		doc, err := client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Get(context.Background())

		if err != nil {
			log.Printf("Error getting melanoma document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		if doc.Exists() {
			var spotData route_types.SpotData
			if err := doc.DataTo(&spotData); err != nil {
				log.Printf("Error converting document to SpotData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			// Delete the old image from Storage
			bucketName := "pocketprotect-cc462.appspot.com"
			path := "users/" + req.UserId + "/melanomaImages/" + req.SpotId
			bucket := storageClient.Bucket(bucketName) // Remove "gs://" prefix
			obj := bucket.Object(path)
			if err := obj.Delete(context.Background()); err != nil {
				log.Printf("Error deleting melanoma image: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			// Upload the new image to Storage
			newPath := "users/" + req.UserId + "/melanomaImages/" + spotData.Storage_Name
			ctx := context.Background()
			newObj := bucket.Object(newPath)
			w := newObj.NewWriter(ctx)
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

			newSpotData := map[string]interface{}{
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
				"gender":             spotData.Gender,
				"storage_name":       spotData.Storage_Name,
				"storage_location":   spotData.Storage_Location,
				"melanomaPictureUrl": downloadURL,
				"created_at":         spotData.Created_At,
			}

			// Update the Firestore document with the new image URL
			_, err = client.Collection("users").Doc(req.UserId).Collection("Melanoma").Doc(req.SpotId).Set(ctx, newSpotData)

			if err != nil {
				log.Printf("Error updating melanoma document: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			return c.NoContent(http.StatusNoContent)
		} else {
			log.Printf("No such document!")
			return c.JSON(http.StatusNotFound, map[string]string{"error": "No such document!"})
		}

	})
}
