package routes

import (
	"context"
	"fmt"
	_ "image/jpeg"
	"log"
	route_types "my-go-project/types"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/labstack/echo/v4"
)

func SetupDiagnosisRoutes(e *echo.Echo, client *firestore.Client) {

	e.POST("client/get/diagnosis", func(c echo.Context) error {
		type GetDiagnosisRequest struct {
			UserId string `json:"userId"`
		}

		var req GetDiagnosisRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		docs, err := client.Collection("users").Doc(req.UserId).Collection("Diagnosis").Documents(context.Background()).GetAll()

		if err != nil {
			log.Printf("Error getting diagnosis documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var diagnosisData []route_types.DiagnosisData
		for _, doc := range docs {
			var data route_types.DiagnosisData
			if err := doc.DataTo(&data); err != nil {
				log.Printf("Error converting document to DiagnosisData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
			diagnosisData = append(diagnosisData, data)
		}

		if len(diagnosisData) == 0 {
			return c.JSON(http.StatusOK, "NoDiagnosis")
		}

		return c.JSON(http.StatusOK, diagnosisData)
	})

	e.POST("client/upload/diagnosis", func(c echo.Context) error {
		type UploadDiagnosisRequest struct {
			UserId string                    `json:"userId"`
			Data   route_types.DiagnosisData `json:"data"`
		}

		var req UploadDiagnosisRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		formattedArray := make([]map[string]string, len(req.Data.Stages.Stage_one.Symphtoms))
		for i, symptom := range req.Data.Stages.Stage_one.Symphtoms {
			formattedArray[i] = map[string]string{
				"numbering": symptom.Numbering,
				"content":   symptom.Content,
			}
		}

		formattedData := map[string]interface{}{
			"id":               req.Data.Id,
			"diagnosis":        req.Data.Diagnosis,
			"clientSymphtoms":  req.Data.ClientSymphtoms,
			"created_at":       req.Data.Created_At,
			"possibleOutcomes": req.Data.PossibleOutcomes,
			"title":            req.Data.Title,
			"stages": map[string]interface{}{
				"stage_one": map[string]interface{}{
					"diagnosis":   req.Data.Stages.Stage_one.Diagnosis,
					"description": req.Data.Stages.Stage_one.Description,
					"symphtoms":   formatSymptoms(req.Data.Stages.Stage_one.Symphtoms),
				},
				"stage_two": map[string]interface{}{
					"periodic_assistance": req.Data.Stages.Stage_two.PeriodicAssistance,
					"chance":              req.Data.Stages.Stage_two.Chance,
					"diagnosis":           req.Data.Stages.Stage_two.Diagnosis,
					"explain_video":       req.Data.Stages.Stage_two.ExplainVideo,
					"help":                formatSymptoms(req.Data.Stages.Stage_two.Help),
					"recovery":            formatSymptoms(req.Data.Stages.Stage_two.Recovery),
					"symphtoms":           formatSymptoms(req.Data.Stages.Stage_two.Symphtoms),
				},
			},
		}

		_, err := client.Collection("users").Doc(req.UserId).Collection("Diagnosis").Doc(req.Data.Id).Set(context.Background(), formattedData)
		if err != nil {
			log.Printf("Error uploading diagnosis data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	})

	e.POST("client/delete/diagnosis", func(c echo.Context) error {
		type DeleteDiagnosisReq struct {
			UserId      string `json:"userId"`
			DiagnosisId string `json:"diagnosisId"`
		}

		var req DeleteDiagnosisReq

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		ref := client.Collection("users").Doc(req.UserId).Collection("Diagnosis").Doc(req.DiagnosisId)
		_, err := ref.Delete(context.Background())

		if err != nil {
			log.Printf("Error deleting diagnosis data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	})
}

func SetupBloodRoutes(e *echo.Echo, client *firestore.Client) {

	e.POST("client/get/blood", func(c echo.Context) error {

		type GetBloodRequest struct {
			UserId string `json:"userId"`
		}

		var req GetBloodRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		doc, err := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("blood_work").Get(context.Background())

		if err != nil {
			log.Printf("Error getting blood document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		if doc.Exists() {
			var data route_types.BloodWorkDoc
			if err := doc.DataTo(&data); err != nil {
				log.Printf("Error converting document to BloodWorkDoc: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			return c.JSON(http.StatusOK, data)
		} else {
			log.Printf("No such document!")
			return c.JSON(http.StatusNotFound, map[string]string{"error": "No such document!"})
		}
	})

	e.POST("client/upload/blood", func(c echo.Context) error {
		type UploadBloodRequest struct {
			UserId     string                          `json:"userId"`
			HigherRisk bool                            `json:"higherRisk"`
			Data       []route_types.BloodWorkCategory `json:"data"`
			CreateDate string                          `json:"createDate"`
			Id         string                          `json:"id"`
		}

		var req UploadBloodRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		ref := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("blood_work")
		ref2 := client.Collection("users").Doc(req.UserId).Collection("Reminders").Doc("blood_work")

		_, err := ref.Set(context.Background(), map[string]interface{}{
			"data":       req.Data,
			"created_at": req.CreateDate,
			"id":         req.Id,
			"risk":       req.HigherRisk,
		})

		if err != nil {
			log.Printf("Error uploading blood data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		splited := formatDate(req.CreateDate)
		var reminderDate map[string]interface{}

		if req.HigherRisk {
			if splited.Month+6 <= 12 {
				reminderDate = map[string]interface{}{
					"expires": fmt.Sprintf("%d-%d-%d", splited.Year, splited.Month+6, splited.Day),
					"id":      "blood_work",
				}
			} else {
				leftOff := splited.Month - 12
				reminderDate = map[string]interface{}{
					"expires": fmt.Sprintf("%d-%d-%d", splited.Year+1, splited.Month+leftOff, splited.Day),
					"id":      "blood_work",
				}
			}
		} else {
			reminderDate = map[string]interface{}{
				"expires": fmt.Sprintf("%d-%d-%d", splited.Year+1, splited.Month, splited.Day),
				"id":      "blood_work",
			}
		}

		_, err = ref2.Set(context.Background(), reminderDate)

		if err != nil {
			log.Printf("Error uploading blood reminder: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)

	})

	e.POST("client/update/blood", func(c echo.Context) error {

		type UpdateBloodRequest struct {
			UserId     string                          `json:"userId"`
			HigherRisk bool                            `json:"higherRisk"`
			Data       []route_types.BloodWorkCategory `json:"data"`
			CreateDate string                          `json:"createDate"`
			Id         string                          `json:"id"`
		}

		var req UpdateBloodRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// Save current data to history
		ref := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("blood_work")

		docSnap, err := ref.Get(context.Background())
		if err != nil {
			log.Printf("Error getting blood document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		if docSnap.Exists() {
			refSave := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("blood_work").Collection("History").Doc(docSnap.Data()["id"].(string))
			_, err = refSave.Set(context.Background(), docSnap.Data())
			if err != nil {
				log.Printf("Error saving blood data to history: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
		}

		// Save new data
		_, err = ref.Set(context.Background(), map[string]interface{}{
			"data":       req.Data,
			"created_at": req.CreateDate,
			"id":         req.Id,
			"risk":       req.HigherRisk,
		})

		if err != nil {
			log.Printf("Error uploading blood data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	})

	e.POST("client/get/blood-history", func(c echo.Context) error {
		type GetBloodHistoryRequest struct {
			UserId string `json:"userId"`
		}

		var req GetBloodHistoryRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		ref := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("blood_work").Collection("History")
		docs, err := ref.Documents(context.Background()).GetAll()

		if err != nil {
			log.Printf("Error getting blood history documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var historyData []route_types.BloodWorkDoc
		for _, doc := range docs {
			var data route_types.BloodWorkDoc
			if err := doc.DataTo(&data); err != nil {
				log.Printf("Error converting document to BloodWorkDoc: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}
			historyData = append(historyData, data)
		}

		if len(historyData) == 0 {
			return c.JSON(http.StatusOK, "NoHistory")
		}

		return c.JSON(http.StatusOK, historyData)
	})

	e.POST("client/get/allergies", func(c echo.Context) error {
		type GetAllergiesReq struct {
			UserId string `json:"userId"`
		}

		var req GetAllergiesReq

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		doc, err := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("allergies").Get(context.Background())

		if err != nil {
			log.Printf("Error getting allergies document from firestore: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		if doc.Exists() {
			var data route_types.AllergiesDoc
			if err := doc.DataTo(&data); err != nil {
				log.Printf("Error converting document to AllergiesDoc: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			return c.JSON(http.StatusOK, data)
		} else {
			log.Printf("No such document!")
			return c.JSON(http.StatusNotFound, map[string]string{"error": "No such document!"})
		}
	})

	e.POST("client/update/allergies", func(c echo.Context) error {
		type UpdateAllergiesReq struct {
			UserId  string   `json:"userId"`
			NewData []string `json:"newData"`
		}

		var req UpdateAllergiesReq

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request data: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request data"})
		}

		_, err := client.Collection("users").Doc(req.UserId).Collection("Medical_Data").Doc("allergies").Set(context.Background(), map[string]interface{}{
			"allergiesArray": req.NewData,
		}, firestore.MergeAll)

		if err != nil {
			log.Printf("Error updating allergies document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		return c.NoContent(http.StatusNoContent)
	})
}

type Date struct {
	Year  int
	Month int
	Day   int
}

// FOR 	splited := formatDate(req.CreateDate)
func formatDate(dateString string) Date {
	date := time.Now()
	if dateString != "" {
		date, _ = time.Parse(time.RFC3339, dateString)
	}

	return Date{
		Year:  date.Year(),
		Month: int(date.Month()),
		Day:   date.Day(),
	}
}

func formatSymptoms(symptoms []route_types.Symptom) []map[string]string {
	formattedArray := make([]map[string]string, len(symptoms))
	for i, symptom := range symptoms {
		formattedArray[i] = map[string]string{
			"numbering": symptom.Numbering,
			"content":   symptom.Content,
		}
	}
	return formattedArray
}
