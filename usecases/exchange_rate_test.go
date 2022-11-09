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
	suite.Equal(err.Error(), "from currency cannot be empty")
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithEmptyToCurrency() {
	fromCurrency := "USD"
	toCurrency := ""
	_, err := suite.usecase.GetCurrencyRate(fromCurrency, toCurrency)
	suite.Equal(err.Error(), "to currency cannot be empty")
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithError() {
	fromCurrency := "USD"
	toCurrency := "BLR"
	suite.service.On("GetLatestRate", fromCurrency, toCurrency).Return(nil, errors.New("Some generic error"))

	_, err := suite.usecase.GetCurrencyRate(fromCurrency, toCurrency)

	suite.Equal(err.Error(), "Some generic error")
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

	suite.Equal(err.Error(), "Can not find target currency rate")
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
	suite.Equal(result, rate)
	suite.service.AssertExpectations(suite.T())
}

func TestExchangeRateUsecase(t *testing.T) {
	suite.Run(t, new(enchangeUsecaseSuite))
}
