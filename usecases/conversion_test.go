package usecases

import (
	"testing"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/mocks"

	"github.com/stretchr/testify/suite"
)

type conversionUsecaseSuite struct {
	suite.Suite
	repository *mocks.ConversionRepository
	usecase    ConversionUsecase
}

func (suite *conversionUsecaseSuite) SetupSuite() {
	repository := new(mocks.ConversionRepository)
	usecase := InitializeConversionUsecase(repository)
	suite.repository = repository
	suite.usecase = usecase
}

func (suite *conversionUsecaseSuite) TestCreateConversionWithNilValues() {
	err := suite.usecase.CreateConversion(nil)
	suite.Equal(err.Error(), "conversion is nil")
}

//	conversion := entities.Conversion{
//	    From:   "from",
//	    To:     "to",
//	    Amount: 1,
//	    Result: 2,
//	}
func (suite *conversionUsecaseSuite) TestCreateConversionWithInvalidFrom() {
	conversion := entities.Conversion{
		To:     "to",
		Amount: 1,
		Result: 2,
	}

	err := suite.usecase.CreateConversion(&conversion)
	suite.Equal(err.Error(), "From, To, Amount and result cannot be empty")
}

func (suite *conversionUsecaseSuite) TestCreateConversionWithInvalidTo() {
	conversion := entities.Conversion{
		From:   "from",
		Amount: 1,
		Result: 2,
	}

	err := suite.usecase.CreateConversion(&conversion)
	suite.Equal(err.Error(), "From, To, Amount and result cannot be empty")
}

func (suite *conversionUsecaseSuite) TestCreateConversionWithInvalidAmount() {
	conversion := entities.Conversion{
		From:   "from",
		To:     "to",
		Amount: -1,
		Result: 2,
	}

	err := suite.usecase.CreateConversion(&conversion)
	suite.Equal(err.Error(), "From, To, Amount and result cannot be empty")
}

func (suite *conversionUsecaseSuite) TestCreateConversionWithInvalidResult() {
	conversion := entities.Conversion{
		From:   "from",
		To:     "to",
		Amount: 1,
		Result: -2,
	}

	err := suite.usecase.CreateConversion(&conversion)
	suite.Equal(err.Error(), "From, To, Amount and result cannot be empty")
}

func (suite *conversionUsecaseSuite) TestCreateConversion() {
	conversion := entities.Conversion{
		From:   "from",
		To:     "to",
		Amount: 1,
		Result: 2,
	}
	suite.repository.On("CreateConversion", &conversion).Return(nil)

	err := suite.usecase.CreateConversion(&conversion)
	suite.NoError(err)
	suite.repository.AssertExpectations(suite.T())
}

func TestConversionUsecase(t *testing.T) {
	suite.Run(t, new(conversionUsecaseSuite))
}
