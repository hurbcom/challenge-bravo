package controllers

import (
	"bytes"
	"encoding/json"
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

type currencyControllerSuite struct {
	suite.Suite
	usecase    *mocks.CurrencyUsecase
	controller CurrencyController
	routes     *gin.Engine
}

func (suite *currencyControllerSuite) SetupSuite() {
	usecase := new(mocks.CurrencyUsecase)
	controller := InitializeCurrencyController(usecase)

	routes := gin.Default()
	routes.POST("/currency", controller.CreateCurrency)
	routes.GET("/currency", controller.GetAllCurrencies)
	routes.GET("/currency/:id", controller.GetCurrencyBy)
	routes.DELETE("/currency/:id", controller.DeleteCurrency)

	suite.routes = routes
	suite.usecase = usecase
	suite.controller = controller
}

func (suite *currencyControllerSuite) TestCreateCurrencyWithNilValues() {
	req, _ := http.NewRequest("POST", "/currency", nil)
	response := httptest.NewRecorder()
	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusBadRequest, response.Code)
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *currencyControllerSuite) TestCreateCurrency() {
	currency := models.Currency{
		Key:           "created key",
		Description:   "created description",
		QuotationType: "created quotationType",
	}
	suite.usecase.On("CreateCurrency", &currency).Return(nil)

	requestBody, err := json.Marshal(&currency)
	suite.NoError(err)

	req, _ := http.NewRequest("POST", "/currency", bytes.NewBuffer(requestBody))
	response := httptest.NewRecorder()
	suite.routes.ServeHTTP(response, req)

	suite.NoError(err)

	var expectedCurrency models.Currency
	json.NewDecoder(response.Body).Decode(&expectedCurrency)

	suite.Equal(http.StatusOK, response.Code)
	suite.Equal(expectedCurrency.Key, "created key")
	suite.Equal(expectedCurrency.Description, "created description")
	suite.Equal(expectedCurrency.QuotationType, "created quotationType")
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *currencyControllerSuite) TestGetAllCurrencies() {
	currencies := []models.Currency{
		{
			Key:           "USD",
			Description:   "USD Description",
			QuotationType: "QuotationType",
		},
	}

	suite.usecase.On("GetAllCurrencies").Return(&currencies, nil)

	req, _ := http.NewRequest("GET", "/currency", nil)
	response := httptest.NewRecorder()
	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusOK, response.Code)
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *currencyControllerSuite) TestGetCurrencyByNotFound() {
	column := "id"
	id := "1"

	suite.usecase.On("GetCurrencyBy", column, id).Return(nil, nil)

	req, _ := http.NewRequest("GET", fmt.Sprintf("/currency/%s", id), nil)
	response := httptest.NewRecorder()
	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"Not found":"Currency not found"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusNotFound, response.Code)
	suite.Equal(expectedResponse, string(responseBody))
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *currencyControllerSuite) TestGetCurrencyBy() {
	column := "id"
	id := "2"
	currency := models.Currency{
		Key:           "USD",
		Description:   "USD Description",
		QuotationType: "QuotationType",
	}

	suite.usecase.On("GetCurrencyBy", column, id).Return(&currency, nil)

	req, _ := http.NewRequest("GET", fmt.Sprintf("/currency/%s", id), nil)
	response := httptest.NewRecorder()
	suite.routes.ServeHTTP(response, req)

	var expectedCurrency models.Currency
	json.NewDecoder(response.Body).Decode(&expectedCurrency)

	suite.Equal(http.StatusOK, response.Code)
	suite.Equal(expectedCurrency.Key, "USD")
	suite.Equal(expectedCurrency.Description, "USD Description")
	suite.Equal(expectedCurrency.QuotationType, "QuotationType")
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *currencyControllerSuite) TestDeleteCurrency() {
	id := 1
	suite.usecase.On("DeleteCurrency", id).Return(nil)

	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/currency/%d", id), nil)
	response := httptest.NewRecorder()
	suite.routes.ServeHTTP(response, req)

	expectedResponse := `{"data":"Currency successfully deleted"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusOK, response.Code)
	suite.Equal(expectedResponse, string(responseBody))
	suite.usecase.AssertExpectations(suite.T())
}

func TestCurrencyController(t *testing.T) {
	suite.Run(t, new(currencyControllerSuite))
}
