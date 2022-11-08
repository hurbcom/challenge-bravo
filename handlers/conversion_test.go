package handlers

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/suite"
)

type conversionHandlerSuite struct {
	suite.Suite
	conversionUsecase   *mocks.ConversionUsecase
	currencyUsecase     *mocks.CurrencyUsecase
	exchangeRateUsecase *mocks.ExchangeRateUsecase
	handler             ConversionHandler
	routes              *gin.Engine
}

func (suite *conversionHandlerSuite) SetupSuite() {
	conversionUsecase := new(mocks.ConversionUsecase)
	currencyUsecase := new(mocks.CurrencyUsecase)
	exchangeRateUsecase := new(mocks.ExchangeRateUsecase)
	handler := InitializeConversionHandler(conversionUsecase, currencyUsecase, exchangeRateUsecase)

	routes := gin.Default()
	routes.GET("/conversion", handler.Convert)

	suite.routes = routes
	suite.conversionUsecase = conversionUsecase
	suite.currencyUsecase = currencyUsecase
	suite.exchangeRateUsecase = exchangeRateUsecase
	suite.handler = handler
}

func (suite *conversionHandlerSuite) TestConvertCurrencyWithoutFromParam() {
	from := ""
	to := "USD"
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"From parameter is required"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.Equal(expectedResponse, string(responseBody))

	suite.conversionUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencyWithoutToParam() {
	from := "BRL"
	to := ""
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"To parameter is required"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.Equal(expectedResponse, string(responseBody))

	suite.conversionUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencyWithoutAmountParam() {
	from := "BRL"
	to := "USD"
	amount := 0.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"Amount parameter is required"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.Equal(expectedResponse, string(responseBody))

	suite.conversionUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencyNotFoundFromCurrency() {
	from := "BRL"
	to := "USD"
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(nil, nil)

	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"From currency does not exists or is not available to conversion"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.Equal(expectedResponse, string(responseBody))

	suite.conversionUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencyNotFoundToCurrency() {
	from := "BRL"
	to := "USD"
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	fromCurrency := entities.Currency{
		Key: from,
	}

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(fromCurrency, nil)
	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(nil, nil)

	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"From currency does not exists or is not available to conversion"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.Equal(expectedResponse, string(responseBody))

	suite.conversionUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencyInternalServerError() {
	from := "BRL"
	to := "USD"
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	toCurrency := entities.Currency{
		Key: to,
	}

	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(&toCurrency, nil)
	suite.exchangeRateUsecase.On("GetCurrencyRate", to).Return(nil, errors.New("Some generic error "))

	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusInternalServerError, response.Code)
	suite.conversionUsecase.AssertExpectations(suite.T())
}

// func (suite *conversionHandlerSuite) TestConvertCurrencySuccessfully() {
// 	from := "BRL"
// 	to := "USD"
// 	amount := 10.0
// 	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

// 	req, _ := http.NewRequest("GET", urlPath, nil)
// 	response := httptest.NewRecorder()

// 	exchangeResult := entities.ExchangeResult{
// 		Success: true,
// 		Base:    "USD",
// 		Date:    "2022-11-08",
// 		Rates:   map[string]float32{"USD": 50.0},
// 	}

// 	suite.exchangeRateUsecase.On("GetCurrencyRate", to).Return(&exchangeResult, nil)

// 	suite.routes.ServeHTTP(response, req)

// 	suite.Equal(http.StatusOK, response.Code)
// 	suite.conversionUsecase.AssertExpectations(suite.T())
// }

func TestConversionHandler(t *testing.T) {
	suite.Run(t, new(conversionHandlerSuite))
}
