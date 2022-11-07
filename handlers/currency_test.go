package handlers

import (
	"bytes"
	"encoding/json"
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

type currencyHandlerSuite struct {
	suite.Suite
	usecase       *mocks.CurrencyUsecase
	handler       CurrencyHandler
	testingServer *httptest.Server
}

func (suite *currencyHandlerSuite) SetupSuite() {
	usecase := new(mocks.CurrencyUsecase)
	handler := InitializeCurrencyHandler(usecase)

	router := gin.Default()
	router.POST("/currency", handler.CreateCurrency)
	router.GET("/currency", handler.GetAllCurrencies)
	router.GET("/currency/:id", handler.GetCurrencyByID)

	testingServer := httptest.NewServer(router)

	suite.testingServer = testingServer
	suite.usecase = usecase
	suite.handler = handler
}

func (suite *currencyHandlerSuite) TearDownSuite() {
	defer suite.testingServer.Close()
}

func (suite *currencyHandlerSuite) TestCreateCurrencyWithNilValues() {
	response, _ := http.Post(fmt.Sprintf("%s/currency", suite.testingServer.URL), "application/json", nil)

	suite.Equal(http.StatusBadRequest, response.StatusCode)
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *currencyHandlerSuite) TestCreateCurrency() {
	currency := entities.Currency{
		Key:           "created key",
		Description:   "created description",
		QuotationType: "created quotationType",
	}

	suite.usecase.On("CreateCurrency", &currency).Return(nil)

	requestBody, err := json.Marshal(&currency)
	suite.NoError(err, "can not marshal struct to json")

	response, err := http.Post(fmt.Sprintf("%s/currency", suite.testingServer.URL), "application/json", bytes.NewBuffer(requestBody))
	suite.NoError(err, "no error when calling the endpoint")
	defer response.Body.Close()

	var expectedCurrency entities.Currency
	json.NewDecoder(response.Body).Decode(&expectedCurrency)

	suite.Equal(http.StatusOK, response.StatusCode)
	suite.Equal(expectedCurrency.Key, "created key")
	suite.Equal(expectedCurrency.Description, "created description")
	suite.Equal(expectedCurrency.QuotationType, "created quotationType")
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *currencyHandlerSuite) TestGetAllCurrencies() {
	currencies := []entities.Currency{
		{
			Key:           "USD",
			Description:   "USD Description",
			QuotationType: "QuotationType",
		},
	}

	suite.usecase.On("GetAllCurrencies").Return(&currencies, nil)

	response, err := http.Get(fmt.Sprintf("%s/currency", suite.testingServer.URL))
	suite.NoError(err, "no error when calling this endpoint")
	defer response.Body.Close()

	suite.Equal(http.StatusOK, response.StatusCode)
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *currencyHandlerSuite) TestGetCurrencyByIDNotFound() {
	id := 1

	suite.usecase.On("GetCurrencyByID", id).Return(nil, nil)
	response, err := http.Get(fmt.Sprintf("%s/currency/%d", suite.testingServer.URL, id))
	suite.NoError(err, "no error when calling this endpoint")
	defer response.Body.Close()

	expectedResponse := `{"Not found":"Currency not found"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	suite.Equal(http.StatusNotFound, response.StatusCode)
	suite.Equal(expectedResponse, string(responseBody))
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *currencyHandlerSuite) TestGetCurrencyByID() {
	id := 2
	currency := entities.Currency{
		Key:           "USD",
		Description:   "USD Description",
		QuotationType: "QuotationType",
	}

	suite.usecase.On("GetCurrencyByID", id).Return(&currency, nil)
	response, err := http.Get(fmt.Sprintf("%s/currency/%d", suite.testingServer.URL, id))
	suite.NoError(err, "no error when calling this endpoint")
	defer response.Body.Close()

	var expectedCurrency entities.Currency
	json.NewDecoder(response.Body).Decode(&expectedCurrency)

	suite.Equal(http.StatusOK, response.StatusCode)
	suite.Equal(expectedCurrency.Key, "USD")
	suite.Equal(expectedCurrency.Description, "USD Description")
	suite.Equal(expectedCurrency.QuotationType, "QuotationType")
	suite.usecase.AssertExpectations(suite.T())
}

func TestCurrencyHandler(t *testing.T) {
	suite.Run(t, new(currencyHandlerSuite))
}
