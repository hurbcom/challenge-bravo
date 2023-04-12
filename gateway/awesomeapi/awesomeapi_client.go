package awesomeapi

import (
    "encoding/json"
    "fmt"
    env "github.com/VictorNapoles/challenge-bravo/infra/environment"
    "github.com/VictorNapoles/challenge-bravo/infra/http_client"
)

const (
    GET_AVAILABLE_QUOTES_URI     = "/json/available"
    API_AWESOME_BASE_URL_ENV_VAR = "API_AWESOME_BASE_URL"
)

type (
    QuoteResultDto map[string]QuoteDto

    QuoteDto struct {
        From   string `json:"code"`
        To     string `json:"codein"`
        Name   string `json:"name"`
        Amount string `json:"ask"`
    }

    AwesomeApiClient interface {
        GetQuote(from, to string) (QuoteDto, error)
        GetAvailableQuotes() (map[string]string, error)
    }

    awesomeApiClientImpl struct {
        httpClient  http_client.HttpClient
        environment env.Environment
    }
)

func NewAwesomeApiClient(httpClient http_client.HttpClient, environment env.Environment) AwesomeApiClient {
    return &awesomeApiClientImpl{httpClient, environment}
}

func (a *awesomeApiClientImpl) GetQuote(from, to string) (QuoteDto, error) {
    url := a.getUrl(fmt.Sprintf("/last/%s-%s", from, to))
    r, err := a.httpClient.Get(url)

    if err != nil {
        return QuoteDto{}, err
    }
    defer r.Body.Close()

    var result QuoteResultDto
    json.NewDecoder(r.Body).Decode(&result)
    return result[fmt.Sprintf("%s%s", from, to)], nil
}

func (a *awesomeApiClientImpl) GetAvailableQuotes() (map[string]string, error) {
    url := a.getUrl(GET_AVAILABLE_QUOTES_URI)
    r, err := a.httpClient.Get(url)

    if err != nil {
        return nil, err
    }
    defer r.Body.Close()

    var result map[string]string
    json.NewDecoder(r.Body).Decode(&result)
    return result, nil
}

func (a *awesomeApiClientImpl) getUrl(uri string) string {
    baseUrl, _ := a.environment.Get(API_AWESOME_BASE_URL_ENV_VAR)
    url := fmt.Sprintf("%s%s", baseUrl, uri)
    return url
}
