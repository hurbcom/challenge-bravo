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

	configs := config.GetTestConfig()
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
		Key:         "unique_key",
		Description: "description",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)
}

func (suite *currencyRepositorySuite) TestCreateCurrencyWithDuplicatedKey() {
	currency := models.Currency{
		Key:         "key",
		Description: "description",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)

	err = suite.repository.CreateCurrency(&currency)
	suite.Equal("pq: duplicate key value violates unique constraint \"currencies_key_key\"", err.Error())
}

func (suite *currencyRepositorySuite) TestGetAllCurrencies() {
	currency := models.Currency{
		Key:         "key_one",
		Description: "description",
	}

	currencyOne := models.Currency{
		Key:         "key_two",
		Description: "description",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)
	err = suite.repository.CreateCurrency(&currencyOne)
	suite.NoError(err)

	currencies, err := suite.repository.GetAllCurrencies()
	suite.NoError(err)
	suite.Equal(2, len(*currencies))
}

func (suite *currencyRepositorySuite) TestGetCurrencyByIdNotFound() {
	id := 1

	_, err := suite.repository.GetCurrencyById(id)
	suite.Error(err)
	suite.Equal("sql: no rows in result set", err.Error())
}

func (suite *currencyRepositorySuite) TestGetCurrencyById() {
	id := 1
	currency := models.Currency{
		Key:         "key",
		Description: "description",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)

	result, err := suite.repository.GetCurrencyById(id)
	suite.NoError(err)
	suite.Equal((*result).Key, currency.Key)
	suite.Equal((*result).Description, currency.Description)
}

func (suite *currencyRepositorySuite) TestGetCurrencyByKeyNotFound() {
	key := "NOT"

	_, err := suite.repository.GetCurrencyByKey(key)
	suite.Error(err)
	suite.Equal("sql: no rows in result set", err.Error())
}

func (suite *currencyRepositorySuite) TestGetCurrencyByKey() {
	key := "key"
	currency := models.Currency{
		Key:         "key",
		Description: "description",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)

	result, err := suite.repository.GetCurrencyByKey(key)
	suite.NoError(err)
	suite.Equal((*result).Key, currency.Key)
	suite.Equal((*result).Description, currency.Description)
}

func (suite *currencyRepositorySuite) TestDeleteCurrency() {
	id := 1
	currency := models.Currency{
		Key:         "key",
		Description: "description",
	}

	err := suite.repository.CreateCurrency(&currency)
	suite.NoError(err)

	_, err = suite.repository.GetCurrencyById(id)
	suite.NoError(err)

	err = suite.repository.DeleteCurrency(1)
	suite.NoError(err)

	_, err = suite.repository.GetCurrencyById(id)
	suite.Equal("sql: no rows in result set", err.Error())
}

func TestCurrencyRepository(t *testing.T) {
	suite.Run(t, new(currencyRepositorySuite))
}
