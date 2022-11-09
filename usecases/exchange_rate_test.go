package usecases

import (
	"errors"
	"testing"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
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

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithNilFromCurrency() {
	toCurrency := models.Currency{
		Key: "BLR",
	}
	_, err := suite.usecase.GetCurrencyRate(nil, &toCurrency)
	suite.Equal("from currency cannot be nil", err.Error())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithNilToCurrency() {
	fromCurrency := models.Currency{
		Key: "USD",
	}

	_, err := suite.usecase.GetCurrencyRate(&fromCurrency, nil)
	suite.Equal("to currency cannot be nil", err.Error())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithError() {
	fromCurrency := models.Currency{
		Key: "USD",
	}
	toCurrency := models.Currency{
		Key: "BLR",
	}
	suite.service.On("GetLatestRate", &fromCurrency, &toCurrency).Return(nil, errors.New("Some generic error"))

	_, err := suite.usecase.GetCurrencyRate(&fromCurrency, &toCurrency)

	suite.Equal("Some generic error", err.Error())
	suite.service.AssertExpectations(suite.T())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithNotFoundRate() {
	fromCurrency := models.Currency{
		Key: "NOT-EXISTS",
	}
	toCurrency := models.Currency{
		Key: "NOT-EXISTS",
	}
	rate := float32(1.1)
	exchangeResult := entities.ExchangeResult{
		Success: true,
		Base:    "USD",
		Rates:   map[string]float32{"BRL": rate},
	}
	suite.service.On("GetLatestRate", &fromCurrency, &toCurrency).Return(&exchangeResult, nil)

	_, err := suite.usecase.GetCurrencyRate(&fromCurrency, &toCurrency)

	suite.Equal("Can not find target currency rate", err.Error())
	suite.service.AssertExpectations(suite.T())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRate() {
	fromCurrency := models.Currency{
		Key: "USD",
	}
	toCurrency := models.Currency{
		Key: "BRL",
	}
	rate := float32(1.1)
	exchangeResult := entities.ExchangeResult{
		Success: true,
		Base:    "USD",
		Rates:   map[string]float32{"BRL": rate},
	}
	suite.service.On("GetLatestRate", &fromCurrency, &toCurrency).Return(&exchangeResult, nil)

	result, err := suite.usecase.GetCurrencyRate(&fromCurrency, &toCurrency)

	suite.NoError(err)
	suite.Equal(rate, result)
	suite.service.AssertExpectations(suite.T())
}

func TestExchangeRateUsecase(t *testing.T) {
	suite.Run(t, new(enchangeUsecaseSuite))
}
