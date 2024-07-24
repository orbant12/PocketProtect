package routes

import (
	"context"
	_ "image/jpeg"
	"log"
	route_types "my-go-project/types"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/labstack/echo/v4"
)

func SetupAssistantRoutes(e *echo.Echo, client *firestore.Client) {

	e.POST("assistant/get-by-field/data", func(c echo.Context) error {

		type GetAssistantByFieldRequest struct {
			Field string `json:"field"` //"dermatologist"
		}

		var req GetAssistantByFieldRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		assistantRef := client.Collection("assistants")
		docs, err := assistantRef.Documents(context.Background()).GetAll()

		if err != nil {
			log.Printf("Error getting assistants documents: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		var assistants []route_types.AssistantData
		for _, doc := range docs {
			var data route_types.AssistantData
			if err := doc.DataTo(&data); err != nil {
				log.Printf("Error converting document to AssistantData: %v", err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
			}

			if data.Field == req.Field {
				assistants = append(assistants, data)
			}
		}

		if len(assistants) == 0 {
			return c.JSON(http.StatusOK, "NoAssistants")
		}

		return c.JSON(http.StatusOK, assistants)
	})

	e.POST("assistant/update/chat", func(c echo.Context) error {

		type GetChatRealtimeRequest struct {
			UserId    string `json:"userId"`
			SessionId string `json:"sessionId"`
			Chat      []struct {
				Date          string `json:"date"`
				Message       string `json:"message"`
				Inline_answer bool   `json:"inline_answer"`
				Sent          bool   `json:"sent"`
				User          string `json:"user"`
			} `json:"chat"`
		}

		var req GetChatRealtimeRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		clientRef := client.Collection("users").Doc(req.UserId).Collection("Assist_Panel").Doc(req.SessionId)

		chatFormat := []map[string]interface{}{}

		for _, message := range req.Chat {
			chatFormat = append(chatFormat, map[string]interface{}{
				"sent":          message.Sent,
				"date":          message.Date,
				"inline_answer": message.Inline_answer,
				"message":       message.Message,
				"user":          message.User,
			})
		}

		_, err := clientRef.Update(c.Request().Context(), []firestore.Update{
			{
				Path:  "chat",
				Value: chatFormat,
			},
		})

		if err != nil {
			log.Printf("Error updating document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, map[string]string{"status": "success"})
	})

	e.POST("assistant/get/chat", func(c echo.Context) error {
		type GetChatRequest struct {
			SessionId string `json:"sessionId"`
			ClientId  string `json:"clientId"`
		}

		var req GetChatRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		clientRef := client.Collection("users").Doc(req.ClientId).Collection("Assist_Panel").Doc(req.SessionId)
		docSnapshot, err := clientRef.Get(c.Request().Context())
		if err != nil {
			log.Printf("Error getting document: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		if docSnapshot.Exists() {
			data := docSnapshot.Data()
			chat, ok := data["chat"].([]interface{})
			if !ok {
				log.Printf("Error casting chat data")
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error processing chat data"})
			}
			return c.JSON(http.StatusOK, chat)
		}

		return c.JSON(http.StatusOK, []interface{}{})
	})

}
