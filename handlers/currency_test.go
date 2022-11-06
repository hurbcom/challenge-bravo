package handlers

import (
	"encoding/json"
	"fmt"
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
	// router.GET("/currency/:id", handler.GetCurrencyByID)

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

	responseBody := entities.Response{}
	json.NewDecoder(response.Body).Decode(&responseBody)

	suite.Equal(http.StatusBadRequest, response.StatusCode)
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

	responseBody := entities.Response{}
	json.NewDecoder(response.Body).Decode(&responseBody)

	suite.Equal(http.StatusOK, response.StatusCode)
	suite.usecase.AssertExpectations(suite.T())
}

func TestCurrencyHandler(t *testing.T) {
	suite.Run(t, new(currencyHandlerSuite))
}
