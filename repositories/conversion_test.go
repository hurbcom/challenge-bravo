package repositories

import (
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/config"
	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/utils"

	"github.com/stretchr/testify/suite"
)

type conversionRepositorySuite struct {
	suite.Suite
	repository      ConversionRepository
	cleanupExecutor utils.TruncateTableExecutor
}

func (suite *conversionRepositorySuite) SetupSuite() {

	configs := config.GetConfig()
	db := config.ConnectDB(configs)
	repository := InitializeConversionRepository(db)

	suite.repository = repository
	suite.cleanupExecutor = utils.InitTruncateTableExecutor(db)
}

func (suite *conversionRepositorySuite) TearDownTest() {
	defer suite.cleanupExecutor.TruncateTable([]string{"conversions"})
}

func (suite *conversionRepositorySuite) TestCreateConversion() {
	conversion := entities.Conversion{
		From:   "From",
		To:     "To",
		Amount: 1.1,
		Result: 2.2,
	}

	err := suite.repository.CreateConversion(&conversion)
	suite.NoError(err)
}

func TestConversionRepository(t *testing.T) {
	suite.Run(t, new(conversionRepositorySuite))
}
