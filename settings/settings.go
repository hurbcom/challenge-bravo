package settings

import (
	"encoding/json"
	"os"
)

type Settings struct {
	ApiKey              string
	ApiUrl              string
	BackingCurrencyCode string
	Db                  DbSettings
}

type DbSettings struct {
	ConnectionString string
	Name             string
}

const settingsName = "settings.json"

func NewSettings() (*Settings, error) {
	bytes, err := os.ReadFile(settingsName)
	if err != nil {
		return nil, err
	}
	var result Settings
	err = json.Unmarshal(bytes, &result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
