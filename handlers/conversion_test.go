package handlers

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/suite"
)

type conversionHandlerSuite struct {
	suite.Suite
	conversionUsecase *mocks.ConversionUsecase
	currencyUsecase   *mocks.CurrencyUsecase
	handler           ConversionHandler
	routes            *gin.Engine
}

func (suite *conversionHandlerSuite) SetupSuite() {
	conversionUsecase := new(mocks.ConversionUsecase)
	currencyUsecase := new(mocks.CurrencyUsecase)
	handler := InitializeConversionHandler(conversionUsecase, currencyUsecase)

	routes := gin.Default()
	routes.GET("/conversion", handler.Convert)

	suite.routes = routes
	suite.conversionUsecase = conversionUsecase
	suite.currencyUsecase = currencyUsecase
	suite.handler = handler
}

func (suite *conversionHandlerSuite) TestConvertCurrencyWithoutFromParam() {
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", "", "EUR", 1.0)
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
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", "BRL", "", 1.0)
	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"To parameter is required"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.Equal(expectedResponse, string(responseBody))

	suite.conversionUsecase.AssertExpectations(suite.T())
}

func (suite *conversionHandlerSuite) TestConvertCurrencyWithoutToAmount() {
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", "BRL", "USD", 0.0)
	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()

	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"Amount parameter is required"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.Equal(expectedResponse, string(responseBody))

	suite.conversionUsecase.AssertExpectations(suite.T())
}

func TestConversionHandler(t *testing.T) {
	suite.Run(t, new(conversionHandlerSuite))
}
