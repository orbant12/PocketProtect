package routes

import (
	"context"
	_ "image/jpeg"
	"log"
	route_types "my-go-project/types"
	"net/http"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	"github.com/labstack/echo/v4"
)

var bucketName = "pocketprotect-cc462.appspot.com"

func SetupClientRoutes(e *echo.Echo, client *firestore.Client, storageClient *storage.Client) {
	// Client routes
	e.POST("/client/get/user-data", func(c echo.Context) error {
		var req route_types.UserDataRequest
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

		var userData route_types.UserData
		if err := doc.DataTo(&userData); err != nil {
			log.Printf("Error converting document to UserData: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, userData)
	})

	e.POST("/client/get/user-sessions", func(c echo.Context) error {
		type UserSessionRequest struct {
			UserId string `json:"userId"`
		}

		var req UserSessionRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		clientRef := client.Collection("users").Doc(req.UserId).Collection("Assist_Panel")
		snapshot, err := clientRef.Documents(context.Background()).GetAll()
		if err != nil {
			log.Printf("Error getting user sessions: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var sessionData []map[string]interface{}

		for _, doc := range snapshot {
			data := doc.Data()
			sessionData = append(sessionData, data)
		}

		return c.JSON(http.StatusOK, sessionData)
	})

	e.PATCH("/client/update/user-data", func(c echo.Context) error {
		type UpdateUserDataRequest struct {
			FieldNameToChange string      `json:"fieldNameToChange"`
			DataToChange      interface{} `json:"dataToChange"`
			UserID            string      `json:"userId"`
		}

		var req UpdateUserDataRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		updates := []firestore.Update{
			{
				Path:  req.FieldNameToChange,
				Value: req.DataToChange,
			},
		}

		// Update the Firestore document
		_, err := client.Collection("users").Doc(req.UserID).Update(context.Background(), updates)
		if err != nil {
			log.Printf("Failed to update user data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, map[string]string{"status": "success"})
	})

	e.POST(("/client/update/profile-picture"), func(c echo.Context) error {
		type UpdateProfilePictureRequest struct {
			UserId      string `json:"userId"`
			ProfileBlob []byte `json:"profileBlob"`
		}

		var req UpdateProfilePictureRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		ctx := context.Background()
		bucket := storageClient.Bucket(bucketName) // Remove "gs://" prefix
		obj := bucket.Object("users/" + req.UserId + "/profilePicture")
		//PERMISSION PUBLIC
		w := obj.NewWriter(ctx)
		_, err := w.Write(req.ProfileBlob)
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

		updates := []firestore.Update{
			{
				Path:  "profileUrl",
				Value: downloadURL,
			},
		}

		// Update the Firestore document
		_, err = client.Collection("users").Doc(req.UserId).Update(context.Background(), updates)

		if err != nil {
			log.Printf("Failed to update user data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		//Return no content
		return c.NoContent(http.StatusNoContent)
	})

	e.POST("client/register/user-data", func(c echo.Context) error {
		type NewUserRegisterReq struct {
			Data   route_types.UserData `json:"data"`
			UserId string               `json:"userId"`
		}

		var req NewUserRegisterReq

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		userData := map[string]interface{}{
			"uid":        req.Data.UID,
			"fullname":   req.Data.FullName,
			"profileUrl": req.Data.ProfileUrl,
			"gender":     req.Data.Gender,
			"user_since": req.Data.UserSince,
			"birth_date": req.Data.BirthDate,
			"email":      req.Data.Email,
		}

		_, err := client.Collection("users").Doc(req.UserId).Set(context.Background(), userData)

		if err != nil {
			log.Printf("Error saving user data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to save user data"})
		}

		return c.NoContent(http.StatusOK)
	})
}
