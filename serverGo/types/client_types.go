package route_types

import "time"

type (
	UserDataRequest struct {
		UserID string `json:"userId"`
	}

	UserData struct {
		FullName   string    `json:"fullname"`
		Email      string    `json:"email"`
		ProfileUrl string    `json:"profileUrl"`
		Gender     string    `json:"gender"`
		BirthDate  time.Time `json:"birth_date"`
		UID        string    `json:"uid"`
		UserSince  string    `json:"user_since"`
	}

	UpdateUserDataRequest struct {
		FieldNameToChange string      `json:"fieldNameToChange"`
		DataToChange      interface{} `json:"dataToChange"`
		UserID            string      `json:"userId"`
	}
)
