package repositories

import (
	"testing"

	config "github.com/felipepnascimento/challenge-bravo-flp/config"
	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	utils "github.com/felipepnascimento/challenge-bravo-flp/utils"
	"github.com/stretchr/testify/suite"
)

type tweetRepositorySuite struct {
	// we need this to use the suite functionalities from testify
	suite.Suite
	// the funcionalities we need to test
	repository TweetRepository
	// some helper function to clean-up any used tables
	cleanupExecutor utils.TruncateTableExecutor
}

func (suite *tweetRepositorySuite) SetupSuite() {
	// this function runs once before all tests in the suite

	// some initialization setup
	configs := config.GetConfig()
	db := config.ConnectDB(configs)
	repository := InitializeTweetRepository(db)

	// assign the dependencies we need as the suite properties
	// we need this to run the tests
	suite.repository = repository
	suite.cleanupExecutor = utils.InitTruncateTableExecutor(db)
}

func (suite *tweetRepositorySuite) TearDownTest() {
	// clean-up the used table to be used for another session
	defer suite.cleanupExecutor.TruncateTable([]string{"tweets"})
}

func (suite *tweetRepositorySuite) TestCreateTweet_Positive() {
	// instantiate an entity to be used by the function we want to test
	tweet := entities.Tweet{
		Username: "username",
		Text:     "text",
	}

	// real function we need to test
	err := suite.repository.CreateTweet(&tweet)
	// assertion for the result of our test
	suite.NoError(err, "no error when create tweet with valid input")
}

func (suite *tweetRepositorySuite) TestCreateTweet_NilPointer_Negative() {
	err := suite.repository.CreateTweet(nil)
	suite.Error(err, "create error with nil input returns error")
}

func (suite *tweetRepositorySuite) TestCreateTweet_EmptyFields_Positive() {
	var tweet entities.Tweet
	err := suite.repository.CreateTweet(&tweet)
	suite.NoError(err, "no error when create tweet with empty fields")
}

func (suite *tweetRepositorySuite) TestGetAllTweets_EmptySlice_Positive() {
	tweets, err := suite.repository.GetAllTweets()
	suite.NoError(err, "no error when get all tweets when the table is empty")
	suite.Equal(len(*tweets), 0, "length of tweets should be 0, since it is empty slice")
	suite.Equal(*tweets, []entities.Tweet(nil), "tweets is an empty slice")
}

func (suite *tweetRepositorySuite) TestGetAllTweets_FilledRecords_Positive() {
	tweet := entities.Tweet{
		Username: "username",
		Text:     "text",
	}

	// inserting 3 tweets to be queried later
	err := suite.repository.CreateTweet(&tweet)
	suite.NoError(err, "no error when create tweet with valid input")
	err = suite.repository.CreateTweet(&tweet)
	suite.NoError(err, "no error when create tweet with valid input")
	err = suite.repository.CreateTweet(&tweet)
	suite.NoError(err, "no error when create tweet with valid input")

	tweets, err := suite.repository.GetAllTweets()
	suite.NoError(err, "no error when get all tweets when the table is empty")
	suite.Equal(len(*tweets), 3, "insert 3 records before get all data, so it should contain three tweets")
}

func (suite *tweetRepositorySuite) TestGetTweetByID_NotFound_Negative() {
	id := 1

	_, err := suite.repository.GetTweetByID(id)
	suite.Error(err, "error sql not found")
	suite.Equal(err.Error(), "sql: no rows in result set")
}

func (suite *tweetRepositorySuite) TestGetTweetByID_Exists_Positive() {
	id := 1
	tweet := entities.Tweet{
		Username: "username",
		Text:     "text",
	}

	// will create a record with id 1
	err := suite.repository.CreateTweet(&tweet)
	suite.NoError(err, "no error when create tweet with valid input")

	result, err := suite.repository.GetTweetByID(id)
	suite.NoError(err, "no error because tweet is found")
	suite.Equal(tweet.Username, (*result).Username, "should be equal between result and tweet")
	suite.Equal(tweet.Text, (*result).Text, "should be equal between result and tweet")
}

func TestTweetRepository(t *testing.T) {
	suite.Run(t, new(tweetRepositorySuite))
}
