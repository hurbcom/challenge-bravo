package controllers

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/suite"
)

type conversionControllerSuite struct {
	suite.Suite
	conversionUsecase   *mocks.ConversionUsecase
	currencyUsecase     *mocks.CurrencyUsecase
	exchangeRateUsecase *mocks.ExchangeRateUsecase
	controller          ConversionController
	routes              *gin.Engine
}

func (suite *conversionControllerSuite) SetupSuite() {
	conversionUsecase := new(mocks.ConversionUsecase)
	currencyUsecase := new(mocks.CurrencyUsecase)
	exchangeRateUsecase := new(mocks.ExchangeRateUsecase)
	controller := InitializeConversionController(conversionUsecase, currencyUsecase, exchangeRateUsecase)

	routes := gin.Default()
	routes.GET("/conversion", controller.Convert)

	suite.routes = routes
	suite.conversionUsecase = conversionUsecase
	suite.currencyUsecase = currencyUsecase
	suite.exchangeRateUsecase = exchangeRateUsecase
	suite.controller = controller
}

func (suite *conversionControllerSuite) TestConvertCurrencyWithoutFromParam() {
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

func (suite *conversionControllerSuite) TestConvertCurrencyWithoutToParam() {
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

func (suite *conversionControllerSuite) TestConvertCurrencyWithoutAmountParam() {
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

func (suite *conversionControllerSuite) TestConvertCurrencyNotFoundFromCurrency() {
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

func (suite *conversionControllerSuite) TestConvertCurrencyNotFoundToCurrency() {
	from := "CUR3"
	to := "CUR4"
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	fromCurrency := models.Currency{
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

func (suite *conversionControllerSuite) TestConvertCurrencyInternalServerError() {
	from := "CUR5"
	to := "CUR6"
	amount := 10.0
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	fromCurrency := models.Currency{
		Key: from,
	}
	toCurrency := models.Currency{
		Key: to,
	}
	rate := float32(0)

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(&fromCurrency, nil)
	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(&toCurrency, nil)
	suite.exchangeRateUsecase.On("GetCurrencyRate", from, to).Return(&rate, errors.New("Some generic error "))

	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusInternalServerError, response.Code)
	suite.currencyUsecase.AssertExpectations(suite.T())
	suite.conversionUsecase.AssertExpectations(suite.T())
	suite.exchangeRateUsecase.AssertExpectations(suite.T())
}

func (suite *conversionControllerSuite) TestConvertCurrencyCreateConversionError() {
	from := "CUR7"
	to := "CUR8"
	amount := float32(10.0)
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	fromCurrency := models.Currency{
		Key: from,
	}
	toCurrency := models.Currency{
		Key: to,
	}
	rate := float32(50)
	conversion := models.Conversion{
		From:   from,
		To:     to,
		Amount: amount,
		Result: amount * rate,
	}

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(&fromCurrency, nil)
	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(&toCurrency, nil)
	suite.exchangeRateUsecase.On("GetCurrencyRate", from, to).Return(rate, nil)
	suite.conversionUsecase.On("CreateConversion", &conversion).Return(errors.New("Some generic error"))

	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusInternalServerError, response.Code)
	suite.currencyUsecase.AssertExpectations(suite.T())
	suite.conversionUsecase.AssertExpectations(suite.T())
	suite.exchangeRateUsecase.AssertExpectations(suite.T())
}

func (suite *conversionControllerSuite) TestConvertCurrencySuccessfully() {
	from := "CUR9"
	to := "CUR10"
	amount := float32(10.0)
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", from, to, amount)

	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	fromCurrency := models.Currency{
		Key: from,
	}
	toCurrency := models.Currency{
		Key: to,
	}
	rate := float32(50)
	conversion := models.Conversion{
		From:   from,
		To:     to,
		Amount: amount,
		Result: amount * rate,
	}

	suite.currencyUsecase.On("GetCurrencyBy", "key", from).Return(&fromCurrency, nil)
	suite.currencyUsecase.On("GetCurrencyBy", "key", to).Return(&toCurrency, nil)
	suite.exchangeRateUsecase.On("GetCurrencyRate", from, to).Return(rate, nil)
	suite.conversionUsecase.On("CreateConversion", &conversion).Return(nil)

	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusOK, response.Code)
	suite.currencyUsecase.AssertExpectations(suite.T())
	suite.conversionUsecase.AssertExpectations(suite.T())
	suite.exchangeRateUsecase.AssertExpectations(suite.T())
}

func TestConversionController(t *testing.T) {
	suite.Run(t, new(conversionControllerSuite))
}
