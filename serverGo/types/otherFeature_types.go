package route_types

type (
	Symptom struct {
		Numbering string `json:"numbering"`
		Content   string `json:"content"`
	}
	StageDataTypes_1 struct {
		Diagnosis   string    `json:"diagnosis"`
		Description string    `json:"description"`
		Symphtoms   []Symptom `json:"symphtoms"`
	}

	StageDataTypes_2 struct {
		Diagnosis          string    `json:"diagnosis"`
		Description        string    `json:"description"`
		Chance             string    `json:"chance"`
		ExplainVideo       string    `json:"explain_video"`
		Symphtoms          []Symptom `json:"symphtoms"`
		Help               []Symptom `json:"help"`
		Recovery           []Symptom `json:"recovery"`
		PeriodicAssistance string    `json:"periodic_assistance"`
	}

	DiagnosisData struct {
		Id               string `json:"id"`
		Diagnosis        string `json:"diagnosis"`
		ClientSymphtoms  string `json:"clientSymphtoms"`
		Created_At       string `json:"created_at"`
		PossibleOutcomes string `json:"possibleOutcomes"`
		Stages           struct {
			Stage_one StageDataTypes_1 `json:"stage_one"`
			Stage_two StageDataTypes_2 `json:"stage_two"`
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
