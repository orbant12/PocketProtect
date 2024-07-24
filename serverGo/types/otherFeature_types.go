package route_types

type (
	DiagnosisData struct {
		Id               string `json:"id"`
		Diagnosis        string `json:"diagnosis"`
		ClientSymphtoms  string `json:"clientSymphtoms"`
		Created_At       string `json:"created_at"`
		PossibleOutcomes string `json:"possibleOutcomes"`
		Stages           struct {
			Stage_one []struct {
				A    string `json:"a"`
				Q    string `json:"q"`
				Type string `json:"type"`
			} `json:"stage_one"`
			Stage_two struct {
				Chance string `json:"chance"`
				Survey []struct {
					A    string `json:"a"`
					Q    string `json:"q"`
					Type string `json:"type"`
				} `json:"survey"`
			} `json:"stage_two"`
			Stage_three struct {
				AssistanceFrequency string `json:"assistance_frequency"`
			} `json:"stage_three"`
			Stage_four interface{} `json:"stage_four"`
		} `json:"stages"`
		Title string `json:"title"`
	}

	BloodWorkCategory struct {
		Title string `json:"title"`
		Data  []struct {
			Type   string `json:"type"`
			Number int    `json:"number"`
		} `json:"data"`
	}
	BloodWorkDoc struct {
		Created_at string              `json:"created_at"`
		Data       []BloodWorkCategory `json:"data"`
		Id         string              `json:"id"`
		Risk       bool                `json:"risk"`
	}
)
