package repositories

import (
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/config"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/felipepnascimento/challenge-bravo-flp/utils"

	"github.com/stretchr/testify/suite"
)

type currencyRepositorySuite struct {
	suite.Suite
	repository      CurrencyRepository
	cleanupExecutor utils.TruncateTableExecutor
}

func (suite *currencyRepositorySuite) SetupSuite() {

	configs := config.GetConfig()
	db := config.ConnectDB(configs)
	repository := InitializeCurrencyRepository(db)

	suite.repository = repository
	suite.cleanupExecutor = utils.InitTruncateTableExecutor(db)
}

func (suite *currencyRepositorySuite) TearDownTest() {
	defer suite.cleanupExecutor.TruncateTable([]string{"currencies"})
}

func (suite *currencyRepositorySuite) TestCreateCurrency() {
	currency := models.Currency{
		Key:           "key",
		Description:   "description",
		QuotationType: "quotationType",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)
}

func (suite *currencyRepositorySuite) TestCreateCurrencyWithDuplicatedKey() {
	currency := models.Currency{
		Key:           "key",
		Description:   "description",
		QuotationType: "quotationType",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)

	err = suite.repository.CreateCurrency(&currency)
	suite.Equal(err.Error(), "ERROR: duplicate key value violates unique constraint \"currencies_pkey\" (SQLSTATE 23505)")
}

func (suite *currencyRepositorySuite) TestGetAllCurrencies() {
	currency := models.Currency{
		Key:           "key",
		Description:   "description",
		QuotationType: "quotationType",
	}

	currencyOne := models.Currency{
		Key:           "key_one",
		Description:   "description",
		QuotationType: "quotationType",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)
	err = suite.repository.CreateCurrency(&currencyOne)
	suite.NoError(err)

	currencies, err := suite.repository.GetAllCurrencies()
	suite.NoError(err)
	suite.Equal(len(*currencies), 2, "insert 2 records before get all data, so it should contain three currencies")
}

func (suite *currencyRepositorySuite) TestGetCurrencyByNotFound() {
	column := "id"
	id := "1"

	_, err := suite.repository.GetCurrencyBy(column, id)
	suite.Error(err)
	suite.Equal(err.Error(), "record not found")
}

func (suite *currencyRepositorySuite) TestGetCurrencyBy() {
	column := "id"
	id := "1"
	currency := models.Currency{
		Key:           "key",
		Description:   "description",
		QuotationType: "quotationType",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)

	result, err := suite.repository.GetCurrencyBy(column, id)
	suite.NoError(err)
	suite.Equal(currency.Key, (*result).Key)
	suite.Equal(currency.Description, (*result).Description)
	suite.Equal(currency.QuotationType, (*result).QuotationType)
}

func (suite *currencyRepositorySuite) TestDeleteCurrency() {
	column := "id"
	id := "1"
	currency := models.Currency{
		Key:           "key",
		Description:   "description",
		QuotationType: "quotationType",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)

	_, err = suite.repository.GetCurrencyBy(column, id)
	suite.NoError(err)

	err = suite.repository.DeleteCurrency(1)
	suite.NoError(err)

	_, err = suite.repository.GetCurrencyBy(column, id)
	suite.Equal(err.Error(), "record not found")
}

func TestCurrencyRepository(t *testing.T) {
	suite.Run(t, new(currencyRepositorySuite))
}
