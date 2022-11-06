package usecases

import (
	"errors"
	"testing"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	mocks "github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/stretchr/testify/suite"
)

type tweetUsecaseSuite struct {
	// we need this to use the suite functionalities from testify
	suite.Suite
	// the generated mocked version of our repository
	repository *mocks.TweetRepository
	// the functionalities we want to test
	usecase TweetUsecase
}

func (suite *tweetUsecaseSuite) SetupTest() {
	// instantiate the mocked version of repository
	repository := new(mocks.TweetRepository)
	// inject the repository to usecase, since usecase needs repository to work
	usecase := InitializeTweetUsecase(repository)

	// assign them as the suite properties
	suite.repository = repository
	suite.usecase = usecase
}

func (suite *tweetUsecaseSuite) TestCreateTweet_Positive() {
	// create an example of tweet that will be used in usecase's CreateTweet method
	tweet := entities.Tweet{
		Username: "username",
		Text:     "text",
	}

	// specify that inside usecase's CreateTweet method
	// repository's CreateTweet method will be called
	suite.repository.On("CreateTweet", &tweet).Return(nil)

	// the real operation we need to test
	err := suite.usecase.CreateTweet(&tweet)

	// assertions to make sure our operation does the right thing
	suite.Nil(err, "err is a nil pointer so no error in this process")
	suite.repository.AssertExpectations(suite.T())
}

func (suite *tweetUsecaseSuite) TestCreateTweet_NilPointer_Negative() {
	err := suite.usecase.CreateTweet(nil)
	suite.Error(err.(*entities.AppError).Err, "error when create tweet with nil pointer")
	suite.repository.AssertExpectations(suite.T())
}

func (suite *tweetUsecaseSuite) TestGetAllTweets_EmptySlice_Positive() {
	emptyTweets := []entities.Tweet(nil)
	suite.repository.On("GetAllTweets").Return(&emptyTweets, nil)
	tweets, err := suite.usecase.GetAllTweets()
	suite.NoError(err, "no error when get all tweets")
	suite.Equal(len(*tweets), 0, "tweets is a empty slice object")
}

func (suite *tweetUsecaseSuite) TestGetAllTweets_FilledSlice_Positive() {
	tweets := []entities.Tweet{
		{
			Username: "username",
			Text:     "text",
		},
		{
			Username: "username",
			Text:     "text",
		},
		{
			Username: "username",
			Text:     "text",
		},
	}
	suite.repository.On("GetAllTweets").Return(&tweets, nil)
	result, err := suite.usecase.GetAllTweets()
	suite.NoError(err, "no error when get all tweets")
	suite.Equal(len(*result), len(tweets), "tweets and result should have the same length")
	suite.Equal(*result, tweets, "result and tweets are the same")
}

func (suite *tweetUsecaseSuite) TestGetTweetByID_NotFound_Negative() {
	id := 1

	suite.repository.On("GetTweetByID", id).Return(nil, errors.New("sql: no rows in result set"))

	result, err := suite.usecase.GetTweetByID(id)
	suite.Nil(result, "error is returned so result has to be nil")
	suite.Error(err.(*entities.AppError).Err, "error sql not found")
	suite.Equal(err.Error(), "tweet is not found")
	suite.repository.AssertExpectations(suite.T())
}

func (suite *tweetUsecaseSuite) TestGetTweetByID_Exists_Positive() {
	id := 1
	tweet := entities.Tweet{
		Username: "username",
		Text:     "text",
	}

	suite.repository.On("GetTweetByID", id).Return(&tweet, nil)

	result, err := suite.usecase.GetTweetByID(id)
	suite.Nil(err, "no error when return the tweet")
	suite.Equal(tweet, *result, "result and tweet should be equal")
}

func TestTweetUsecase(t *testing.T) {
	suite.Run(t, new(tweetUsecaseSuite))
}
