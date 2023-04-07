package awesomeapi

import (
	"encoding/json"
	"fmt"
	env "github.com/VictorNapoles/challenge-bravo/infra/environment"
	"github.com/VictorNapoles/challenge-bravo/infra/http_client"
)

type (
	PriceResultDto map[string]PriceDto

	PriceDto struct {
		From   string `json:"code"`
		To     string `json:"codein"`
		Name   string `json:"name"`
		Amount string `json:"ask"`
	}

	AwesomeApiClient interface {
		GetPrice(from, to string) (PriceDto, error)
	}

	awesomeApiClientImpl struct {
		httpClient  http_client.HttpClient
		environment env.Environment
	}
)

func NewAwesomeApiClient(httpClient http_client.HttpClient, environment env.Environment) AwesomeApiClient {
	return &awesomeApiClientImpl{httpClient, environment}
}

func (a *awesomeApiClientImpl) GetPrice(from, to string) (PriceDto, error) {
	url := a.getUrl(fmt.Sprintf("/last/%s-%s", from, to))
	r, err := a.httpClient.Get(url)

	if err != nil {
		return PriceDto{}, err
	}
	defer r.Body.Close()

	var result PriceResultDto
	json.NewDecoder(r.Body).Decode(&result)
	return result[fmt.Sprintf("%s%s", from, to)], nil
}

func (a *awesomeApiClientImpl) getUrl(uri string) string {
	baseUrl, _ := a.environment.Get("API_AWESOME_BASE_URL")
	url := fmt.Sprintf("%s%s", baseUrl, uri)
	return url
}
