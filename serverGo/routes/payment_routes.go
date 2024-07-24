package routes

import (
	"context"
	_ "image/jpeg"
	"log"
	route_types "my-go-project/types"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/labstack/echo/v4"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/paymentintent"
)

func HandlePaymentIntents(c echo.Context) error {
	var req route_types.IntentRequest
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

	return c.JSON(http.StatusOK, route_types.IntentResponse{PaymentIntent: pi.ClientSecret})
}

func SetupPaymentRoutes(e *echo.Echo, client *firestore.Client) {

	e.POST("client/handle/successful-payment", func(c echo.Context) error {
		type HandleSuccessfulPaymentRequest struct {
			CheckOutData route_types.SuccessPurchaseClientCheckoutData `json:"checkOutData"`
			SessionUID   string                                        `json:"session_UID"`
		}

		var req HandleSuccessfulPaymentRequest

		if err := c.Bind(&req); err != nil {
			log.Printf("Error binding request: %v", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		assistantRef := client.Collection("assistants").Doc(req.CheckOutData.AssistantData.Id).Collection("Requests").Doc(req.SessionUID)
		clientRef := client.Collection("users").Doc(req.CheckOutData.ClientData.Id).Collection("Assist_Panel").Doc(req.SessionUID)

		var chatFormat []map[string]interface{}
		var itemFormat []map[string]interface{}

		for _, message := range req.CheckOutData.Chat {
			chatFormat = append(chatFormat, map[string]interface{}{
				"sent":          message.Sent,
				"date":          message.Date,
				"inline_answer": message.Inline_answer,
				"message":       message.Message,
				"user":          message.User,
			})
		}

		for _, item := range req.CheckOutData.Purchase.Item {
			itemFormat = append(itemFormat, map[string]interface{}{
				"melanomaId": item.MelanomaId,
				"melanomaDoc": map[string]interface{}{
					"location": map[string]float64{
						"x": item.MelanomaDoc.Location.X,
						"y": item.MelanomaDoc.Location.Y,
					},
					"spot": map[string]interface{}{
						"slug":      item.MelanomaDoc.Spot.Slug,
						"pathArray": item.MelanomaDoc.Spot.PathArray,
						"color":     item.MelanomaDoc.Spot.Color,
					},
				},
				"risk":               item.Risk,
				"gender":             item.Gender,
				"storage_name":       item.Storage_Name,
				"storage_location":   item.Storage_Location,
				"melanomaPictureUrl": item.MelanomaPictureUrl,
				"created_at":         item.Created_At,
			})
		}

		formatCheckOutData := map[string]interface{}{
			"answered": req.CheckOutData.Answered,
			"assistantData": map[string]interface{}{
				"email":      req.CheckOutData.AssistantData.Email,
				"id":         req.CheckOutData.AssistantData.Id,
				"fullname":   req.CheckOutData.AssistantData.Fullname,
				"profileUrl": req.CheckOutData.AssistantData.ProfileUrl,
				"field":      req.CheckOutData.AssistantData.Field,
			},
			"clientData": map[string]interface{}{
				"birth_date": req.CheckOutData.ClientData.Birth_date,
				"email":      req.CheckOutData.ClientData.Email,
				"fullname":   req.CheckOutData.ClientData.Fullname,
				"gender":     req.CheckOutData.ClientData.Gender,
				"id":         req.CheckOutData.ClientData.Id,
				"profileUrl": req.CheckOutData.ClientData.ProfileUrl,
			},
			"chat":       chatFormat,
			"created_at": req.CheckOutData.Created_at,
			"id":         req.CheckOutData.Id,
			"purchase": map[string]interface{}{
				"item": itemFormat,
				"type": req.CheckOutData.Purchase.Type,
			},
			"result_documents": nil,
		}

		_, err := clientRef.Set(context.Background(), formatCheckOutData)
		if err != nil {
			log.Printf("Error setting client data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		_, err = assistantRef.Set(context.Background(), formatCheckOutData)
		if err != nil {
			log.Printf("Error setting assistant data: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	})
}
