package usecases

import (
	"errors"
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/felipepnascimento/challenge-bravo-flp/models"

	"github.com/stretchr/testify/suite"
)

type currencyUsecaseSuite struct {
	suite.Suite
	repository *mocks.CurrencyRepository
	usecase    CurrencyUsecase
}

func (suite *currencyUsecaseSuite) SetupSuite() {
	repository := new(mocks.CurrencyRepository)
	usecase := InitializeCurrencyUsecase(repository)
	suite.repository = repository
	suite.usecase = usecase
}

func (suite *currencyUsecaseSuite) TestCreateCurrencyWithNilValues() {
	err := suite.usecase.CreateCurrency(nil)
	suite.Equal(err.Error(), "currency is nil")
}

func (suite *currencyUsecaseSuite) TestCreateCurrencyWithInvalidKey() {
	currency := models.Currency{
		Description:   "description",
		QuotationType: "quotationType",
	}

	err := suite.usecase.CreateCurrency(&currency)
	suite.Equal(err.Error(), "key and description cannot be empty")
}

func (suite *currencyUsecaseSuite) TestCreateCurrencyWithInvalidDescription() {
	currency := models.Currency{
		Key:           "key",
		QuotationType: "quotationType",
	}

	err := suite.usecase.CreateCurrency(&currency)
	suite.Equal(err.Error(), "key and description cannot be empty")
}

func (suite *currencyUsecaseSuite) TestCreateCurrency() {
	currency := models.Currency{
		Key:           "key",
		Description:   "description",
		QuotationType: "quotationType",
	}
	suite.repository.On("CreateCurrency", &currency).Return(nil)

	err := suite.usecase.CreateCurrency(&currency)
	suite.NoError(err)
	suite.repository.AssertExpectations(suite.T())
}

func (suite *currencyUsecaseSuite) TestGetAllCurrencies() {
	currencies := []models.Currency{
		{
			Key:           "key",
			Description:   "description",
			QuotationType: "quotationType",
		},
		{
			Key:           "key",
			Description:   "description",
			QuotationType: "quotationType",
		},
	}
	suite.repository.On("GetAllCurrencies").Return(&currencies, nil)

	result, err := suite.usecase.GetAllCurrencies()
	suite.NoError(err)
	suite.Equal(len(*result), len(currencies))
	suite.Equal(*result, currencies)
	suite.repository.AssertExpectations(suite.T())
}

func (suite *currencyUsecaseSuite) TestGetCurrencyByNotFound() {
	column := "id"
	id := "1"
	suite.repository.On("GetCurrencyBy", column, id).Return(nil, errors.New("currency is not found"))
	result, err := suite.usecase.GetCurrencyBy(column, id)

	suite.Nil(result)
	suite.Equal(err.Error(), "currency is not found")
	suite.repository.AssertExpectations(suite.T())
}

func (suite *currencyUsecaseSuite) TestGetCurrencyBy() {
	column := "id"
	id := "2"
	currency := models.Currency{
		Key:           "key",
		Description:   "description",
		QuotationType: "quotationType",
	}

	suite.repository.On("GetCurrencyBy", column, id).Return(&currency, nil)

	result, err := suite.usecase.GetCurrencyBy(column, id)
	suite.Nil(err)
	suite.Equal(currency, *result)
}

func (suite *currencyUsecaseSuite) TestDeleteCurrency() {
	id := 1
	suite.repository.On("DeleteCurrency", id).Return(nil)

	err := suite.usecase.DeleteCurrency(id)
	suite.Nil(err)
}

func TestCurrencyUsecase(t *testing.T) {
	suite.Run(t, new(currencyUsecaseSuite))
}
