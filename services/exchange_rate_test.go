package services

import (
	"bytes"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/stretchr/testify/suite"
)

type exchangeRateServiceSuite struct {
	suite.Suite
	httpClient *mocks.HTTPClient
	service    ExchangeRateService
}

func (suite *exchangeRateServiceSuite) SetupSuite() {
	httpClient := new(mocks.HTTPClient)
	service := InitializeExchangeRateService(httpClient)
	suite.httpClient = httpClient
	suite.service = service
}

func (suite *exchangeRateServiceSuite) TestGetLatestRateWitError() {
	fromCurrency := models.Currency{}
	toCurrency := models.Currency{}
	req := MockGet(&fromCurrency, &toCurrency)
	resp := http.Response{}

	suite.httpClient.On("Do", req).Return(&resp, errors.New("Some generic error"))

	_, err := suite.service.GetLatestRate(&fromCurrency, &toCurrency)
	suite.Equal("An error occurred to makes the request", err.Error())
	suite.httpClient.AssertExpectations(suite.T())
}

func (suite *exchangeRateServiceSuite) TestGetLatestRate() {
	fromCurrency := models.Currency{
		Key: "USD",
	}
	toCurrency := models.Currency{
		Key: "BRL",
	}
	req := MockGet(&fromCurrency, &toCurrency)
	respBody := ioutil.NopCloser(bytes.NewBufferString(`{"Success": true, "Base": "USD", "Date": "2022-11-08", "Rates": {"BRL": 1.1}}`))
	resp := http.Response{
		Body: respBody,
	}

	suite.httpClient.On("Do", req).Return(&resp, nil)

	result, err := suite.service.GetLatestRate(&fromCurrency, &toCurrency)

	expectedResult := entities.ExchangeResult{
		Success: true,
		Base:    "USD",
		Date:    "2022-11-08",
		Rates:   map[string]float32{"BRL": 1.1},
	}

	suite.NoError(err)
	suite.Equal(&expectedResult, result)
	suite.httpClient.AssertExpectations(suite.T())
}

func MockGet(fromCurrency *models.Currency, toCurrency *models.Currency) *http.Request {
	BASE_URL := "https://api.exchangerate.host/latest?base=%s&symbols=%s"

	baseUrl := fmt.Sprintf(BASE_URL, fromCurrency.Key, toCurrency.Key)
	req, _ := http.NewRequest("GET", baseUrl, nil)

	return req
}

func TestExchangeService(t *testing.T) {
	suite.Run(t, new(exchangeRateServiceSuite))
}
