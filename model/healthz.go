package model

type Healthz struct {
	Database string `json:"database"`
	Cache    string `json:"cache"`
}
