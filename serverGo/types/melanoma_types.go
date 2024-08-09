package route_types

import "time"

type (
	GetAllMelanomaDataRequest struct {
		Gender string `json:"gender"`
		UserID string `json:"userId"`
	}

	SpotData struct {
		MelanomaId  string `json:"melanomaId"`
		MelanomaDoc struct {
			Location struct {
				X float64 `json:"x"`
				Y float64 `json:"y"`
			} `json:"location"`
			Spot struct {
				Slug      string      `json:"slug"`
				PathArray interface{} `json:"pathArray"`
				Color     string      `json:"color"`
			} `json:"spot"`
		} `json:"melanomaDoc"`
		Risk               *float32  `json:"risk"`
		Gender             string    `json:"gender"`
		Storage_Name       string    `json:"storage_name"`
		Storage_Location   string    `json:"storage_location"`
		MelanomaPictureUrl string    `json:"melanomaPictureUrl"`
		Created_At         time.Time `json:"created_at"`
	}

	SpotUploadRequest struct {
		SpotData     SpotData `json:"spotData"`
		UserId       string   `json:"userId"`
		MelanomaBlob []byte   `json:"melanomaBlob"`
	}

	GetSpecialMelanomaDataRequest struct {
		UserID string `json:"userId"`
		Gender string `json:"gender"`
	}

	SpecialMelanomaData struct {
		Outdated   []SpotData `json:"outdated"`
		Risky      []SpotData `json:"risky"`
		Unfinished []SpotData `json:"unfinished"`
	}

	UpdateMelanomaRiskRequest struct {
		UserId string   `json:"userId"`
		SpotId string   `json:"spotId"`
		Risk   *float32 `json:"risk"`
	}
	UpdateMelanomaDataRequest struct {
		UserId       string   `json:"userId"`
		SpotId       string   `json:"spotId"`
		NewSpotData  SpotData `json:"newData"`
		MelanomaBlob []byte   `json:"melanomaBlob"`
	}

	ForceDeleteMoleRequest struct {
		UserId string `json:"userId"`
		SpotId string `json:"spotId"`
	}

	DeleteMoleResponse struct {
		Firestore struct {
			Success bool   `json:"success"`
			Message string `json:"message"`
		} `json:"firestore"`
		Storage struct {
			Success bool   `json:"success"`
			Message string `json:"message"`
		} `json:"storage"`
	}

	DeleteMoleRequest struct {
		UserId      string `json:"userId"`
		SpotId      string `json:"spotId"`
		DeleteType  string `json:"deleteType"`
		StorageName string `json:"storage_name"`
	}

	UIDCheckMelanomaRequest struct {
		PendingUID string `json:"pendingUID"`
		UserId     string `json:"userId"`
	}

	UIDCheckMelanomaResponse struct {
		CheckResult bool `json:"checkResult"`
	}

	MelanomaMetaDataRequest struct {
		UserId   string `json:"userId"`
		MetaData struct {
			Sunburn []struct {
				Stage int    `json:"stage"`
				Slug  string `json:"slug"`
			} `json:"sunburn"`
			SkinType         string `json:"skin_type"`
			DetectedRelative string `json:"detected_relative"`
		}
	}
)
