package usecases

import (
	"testing"

	"github.com/stretchr/testify/suite"
)

type enchangeUsecaseSuite struct {
	suite.Suite
	usecase ExchangeUsecase
}

func (suite *enchangeUsecaseSuite) SetupSuite() {
	usecase := InitializeExchangeUsecase()
	suite.usecase = usecase
}

func (suite *enchangeUsecaseSuite) TestTestGetCurrencyRateWithEmptyToCurrency() {
	_, err := suite.usecase.GetCurrencyRate("")
	suite.Equal(err.Error(), "to currency cannot be empty")
}

func TestExchangeUsecase(t *testing.T) {
	suite.Run(t, new(enchangeUsecaseSuite))
}
