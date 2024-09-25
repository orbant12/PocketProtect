package route_types

type (
	UserDataRequest struct {
		UserID string `json:"userId"`
	}

	UserData struct {
		FullName   string `json:"fullname"`
		Email      string `json:"email"`
		ProfileUrl string `json:"profileUrl"`
		Gender     string `json:"gender"`
		Birth_Date string `json:"birth_date"`
		UID        string `json:"uid"`
		UserSince  string `json:"user_since"`
	}

	UpdateUserDataRequest struct {
		FieldNameToChange string      `json:"fieldNameToChange"`
		DataToChange      interface{} `json:"dataToChange"`
		UserID            string      `json:"userId"`
	}
)
