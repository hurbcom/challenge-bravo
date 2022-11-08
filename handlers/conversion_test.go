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
}

func (suite *conversionHandlerSuite) TestConvertCurrencyNotFoundFromCurrency() {
	from := "CUR1"
	to := "CUR2"
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(nil, nil)
	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(nil, nil)

	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"From currency does not exists or is not available to conversion"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.Equal(expectedResponse, string(responseBody))

	suite.currencyUsecase.AssertExpectations(suite.T())
	suite.conversionUsecase.AssertExpectations(suite.T())
	suite.exchangeRateUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencyNotFoundToCurrency() {
	from := "CUR3"
	to := "CUR4"
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	fromCurrency := entities.Currency{
		Key: from,
	}

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(&fromCurrency, nil)
	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(nil, nil)

	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"To currency does not exists or is not available to conversion"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.Equal(expectedResponse, string(responseBody))

	suite.currencyUsecase.AssertExpectations(suite.T())
	suite.conversionUsecase.AssertExpectations(suite.T())
	suite.exchangeRateUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencyInternalServerError() {
	from := "CUR5"
	to := "CUR6"
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	fromCurrency := entities.Currency{
		Key: from,
	}
	toCurrency := entities.Currency{
		Key: to,
	}
	rate := float32(0)

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(&fromCurrency, nil)
	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(&toCurrency, nil)
	suite.exchangeRateUsecase.On("GetCurrencyRate", to).Return(&rate, errors.New("Some generic error "))

	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusInternalServerError, response.Code)
	suite.currencyUsecase.AssertExpectations(suite.T())
	suite.conversionUsecase.AssertExpectations(suite.T())
	suite.exchangeRateUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencyCreateConversionError() {
	from := "CUR7"
	to := "CUR8"
	amount := float32(10.0)
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	fromCurrency := entities.Currency{
		Key: from,
	}
	toCurrency := entities.Currency{
		Key: to,
	}
	rate := float32(50)
	conversion := entities.Conversion{
		From:   from,
		To:     to,
		Amount: amount,
		Result: amount * rate,
	}

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(&fromCurrency, nil)
	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(&toCurrency, nil)
	suite.exchangeRateUsecase.On("GetCurrencyRate", to).Return(rate, nil)
	suite.conversionUsecase.On("CreateConversion", &conversion).Return(errors.New("Some generic error"))

	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusInternalServerError, response.Code)
	suite.currencyUsecase.AssertExpectations(suite.T())
	suite.conversionUsecase.AssertExpectations(suite.T())
	suite.exchangeRateUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencySuccessfully() {
	from := "CUR9"
	to := "CUR10"
	amount := float32(10.0)
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	fromCurrency := entities.Currency{
		Key: from,
	}
	toCurrency := entities.Currency{
		Key: to,
	}
	rate := float32(50)
	conversion := entities.Conversion{
		From:   from,
		To:     to,
		Amount: amount,
		Result: amount * rate,
	}

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(&fromCurrency, nil)
	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(&toCurrency, nil)
	suite.exchangeRateUsecase.On("GetCurrencyRate", to).Return(rate, nil)
	suite.conversionUsecase.On("CreateConversion", &conversion).Return(nil)

	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusOK, response.Code)
	suite.currencyUsecase.AssertExpectations(suite.T())
	suite.conversionUsecase.AssertExpectations(suite.T())
	suite.exchangeRateUsecase.AssertExpectations(suite.T())
}

func TestConversionHandler(t *testing.T) {
	suite.Run(t, new(conversionHandlerSuite))
}
