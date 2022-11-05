package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/victorananias/challenge-bravo/settings"
)

var RateUnavailableError = errors.New("rate unavailable")

type Api struct {
	settings *settings.Settings
}

type CurrentResponse struct {
	Base      string             `json:"base"`
	Date      string             `json:"date"`
	Rates     map[string]float64 `json:"rates"`
	Success   bool               `json:"success"`
	Timestamp int                `json:"timestamp"`
}

func NewApi() *Api {
	api := Api{}
	settings, err := settings.NewSettings()
	if err != nil {
		log.Fatalf("no settings found")
	}
	api.settings = settings
	return &api
}

func (api *Api) CurrentValue(from, to string) (CurrentResponse, error) {
	result := CurrentResponse{}
	url := fmt.Sprintf("%s/latest?base=%s&symbols=%s", api.settings.ApiUrl, from, to)
	log.Printf("external api called: %s", url)

	client := &http.Client{}
	req, err := http.NewRequest(http.MethodGet, url, nil)
	req.Header.Set("apikey", api.settings.ApiKey)

	if err != nil {
		log.Print(err.Error())
		return result, errors.New("error creating external api request")
	}
	res, err := client.Do(req)
	if err != nil {
		log.Print(err.Error())
		return result, errors.New("error consuming external api")
	}
	if res.StatusCode == http.StatusBadRequest {
		return result, RateUnavailableError
	}
	if res.Body != nil {
		defer res.Body.Close()
	}
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Print(err.Error())
		return result, errors.New("error reading external api response")
	}
	err = json.Unmarshal(body, &result)
	if err != nil {
		log.Print(err.Error())
		return result, errors.New("error unmarshing external api response")
	}

	return result, nil
}
