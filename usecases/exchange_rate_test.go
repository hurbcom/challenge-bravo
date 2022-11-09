package usecases

import (
	"errors"
	"testing"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/stretchr/testify/suite"
)

type enchangeUsecaseSuite struct {
	suite.Suite
	service *mocks.ExchangeRateService
	usecase ExchangeRateUsecase
}

func (suite *enchangeUsecaseSuite) SetupSuite() {
	service := new(mocks.ExchangeRateService)
	usecase := InitializeExchangeRateUsecase(service)
	suite.service = service
	suite.usecase = usecase
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithEmptyFromCurrency() {
	fromCurrency := ""
	toCurrency := "BLR"
	_, err := suite.usecase.GetCurrencyRate(fromCurrency, toCurrency)
	suite.Equal("from currency cannot be empty", err.Error())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithEmptyToCurrency() {
	fromCurrency := "USD"
	toCurrency := ""
	_, err := suite.usecase.GetCurrencyRate(fromCurrency, toCurrency)
	suite.Equal("to currency cannot be empty", err.Error())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithError() {
	fromCurrency := "USD"
	toCurrency := "BLR"
	suite.service.On("GetLatestRate", fromCurrency, toCurrency).Return(nil, errors.New("Some generic error"))

	_, err := suite.usecase.GetCurrencyRate(fromCurrency, toCurrency)

	suite.Equal("Some generic error", err.Error())
	suite.service.AssertExpectations(suite.T())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithNotFoundRate() {
	fromCurrency := "NOT-EXISTS"
	toCurrency := "NOT-EXISTS"
	rate := float32(1.1)
	exchangeResult := entities.ExchangeResult{
		Success: true,
		Base:    "USD",
		Rates:   map[string]float32{"BRL": rate},
	}
	suite.service.On("GetLatestRate", fromCurrency, toCurrency).Return(&exchangeResult, nil)

	_, err := suite.usecase.GetCurrencyRate(fromCurrency, toCurrency)

	suite.Equal("Can not find target currency rate", err.Error())
	suite.service.AssertExpectations(suite.T())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRate() {
	fromCurrency := "USD"
	toCurrency := "BRL"
	rate := float32(1.1)
	exchangeResult := entities.ExchangeResult{
		Success: true,
		Base:    "USD",
		Rates:   map[string]float32{"BRL": rate},
	}
	suite.service.On("GetLatestRate", fromCurrency, toCurrency).Return(&exchangeResult, nil)

	result, err := suite.usecase.GetCurrencyRate(fromCurrency, toCurrency)

	suite.NoError(err)
	suite.Equal(rate, result)
	suite.service.AssertExpectations(suite.T())
}

func TestExchangeRateUsecase(t *testing.T) {
	suite.Run(t, new(enchangeUsecaseSuite))
}
