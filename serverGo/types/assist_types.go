package route_types

import "time"

type (
	SuccessPurchaseClientCheckoutData struct {
		Answered      bool `json:"answered"`
		AssistantData struct {
			Fullname   string `json:"fullname"`
			Id         string `json:"id"`
			ProfileUrl string `json:"profileUrl"`
			Email      string `json:"email"`
			Field      string `json:"field"`
		} `json:"assistantData"`
		ClientData struct {
			Fullname   string    `json:"fullname"`
			Id         string    `json:"id"`
			ProfileUrl string    `json:"profileUrl"`
			Email      string    `json:"email"`
			Birth_date time.Time `json:"birth_date"`
			Gender     string    `json:"gender"`
		} `json:"clientData"`
		Chat []struct {
			Date          string `json:"date"`
			Message       string `json:"message"`
			Inline_answer bool   `json:"inline_answer"`
			Sent          bool   `json:"sent"`
			User          string `json:"user"`
		} `json:"chat"`
		Id       string `json:"id"`
		Purchase struct {
			Type string     `json:"type"`
			Item []SpotData `json:"item"`
		} `json:"purchase"`
		Created_at       string `json:"created_at"`
		Result_documents any    `json:"result_documents"`
	}

	AssistantData struct {
		Fullname   string `json:"fullname"`
		Email      string `json:"email"`
		ProfileUrl string `json:"profileUrl"`
		Id         string `json:"id"`
		Field      string `json:"field"`
	}
)
