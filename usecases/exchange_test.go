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
	usecase ExchangeUsecase
}

func (suite *enchangeUsecaseSuite) SetupSuite() {
	service := new(mocks.ExchangeRateService)
	usecase := InitializeExchangeUsecase(service)
	suite.service = service
	suite.usecase = usecase
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithEmptyToCurrency() {
	_, err := suite.usecase.GetCurrencyRate("")
	suite.Equal(err.Error(), "to currency cannot be empty")
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithError() {
	toCurrency := "BLR"
	exchangeResult := entities.ExchangeResult{}
	suite.service.On("GetLatestRate", toCurrency).Return(exchangeResult, errors.New("Some generic error"))

	_, err := suite.usecase.GetCurrencyRate(toCurrency)

	suite.Equal(err.Error(), "Some generic error")
	suite.service.AssertExpectations(suite.T())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithNotFoundRate() {
	toCurrency := "NOT-EXISTS"
	rate := float32(1.1)
	exchangeResult := entities.ExchangeResult{
		Success: true,
		Base:    "USD",
		Rates:   map[string]float32{"BRL": rate},
	}
	suite.service.On("GetLatestRate", toCurrency).Return(exchangeResult, nil)

	_, err := suite.usecase.GetCurrencyRate(toCurrency)

	suite.Equal(err.Error(), "Can not find target currency rate")
	suite.service.AssertExpectations(suite.T())
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRate() {
	toCurrency := "BRL"
	rate := float32(1.1)
	exchangeResult := entities.ExchangeResult{
		Success: true,
		Base:    "USD",
		Rates:   map[string]float32{"BRL": rate},
	}
	suite.service.On("GetLatestRate", toCurrency).Return(exchangeResult, nil)

	result, err := suite.usecase.GetCurrencyRate(toCurrency)

	suite.NoError(err)
	suite.Equal(result, rate)
	suite.service.AssertExpectations(suite.T())
}

func TestExchangeUsecase(t *testing.T) {
	suite.Run(t, new(enchangeUsecaseSuite))
}
