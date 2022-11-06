package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/felipepnascimento/challenge-bravo-flp/utils"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/suite"
)

type tweetHandlerSuite struct {
	// we need this to use the suite functionalities from testify
	suite.Suite
	// the mocked version of the usecase
	usecase *mocks.TweetUsecase
	// the functionalities we need to test
	handler TweetHandler
	// testing server to be used the handler
	testingServer *httptest.Server
}

func (suite *tweetHandlerSuite) SetupSuite() {
	// create a mocked version of usecase
	usecase := new(mocks.TweetUsecase)
	// inject the usecase to be used by handler
	handler := InitializeTweetHandler(usecase)

	// create default server using gin, then register all endpoints
	router := gin.Default()
	router.POST("/tweet", utils.ServeHTTP(handler.CreateTweet))
	router.GET("/tweet", utils.ServeHTTP(handler.GetAllTweets))
	router.GET("/tweet/:id", utils.ServeHTTP(handler.GetTweetByID))

	// create and run the testing server
	testingServer := httptest.NewServer(router)

	// assign the dependencies we need as the suite properties
	// we need this to run the tests
	suite.testingServer = testingServer
	suite.usecase = usecase
	suite.handler = handler
}

func (suite *tweetHandlerSuite) TearDownSuite() {
	defer suite.testingServer.Close()
}

func (suite *tweetHandlerSuite) TestCreateTweet_Positive() {
	// an example tweet for the test
	tweet := entities.Tweet{
		Username: "username",
		Text:     "text",
	}

	// specify that inside handler's CreateTweet method
	// usecase's CreateTweet method will be called
	suite.usecase.On("CreateTweet", &tweet).Return(nil)

	// marshalling and some assertion
	requestBody, err := json.Marshal(&tweet)
	suite.NoError(err, "can not marshal struct to json")

	// calling the testing server given the provided request body
	response, err := http.Post(fmt.Sprintf("%s/tweet", suite.testingServer.URL), "application/json", bytes.NewBuffer(requestBody))
	suite.NoError(err, "no error when calling the endpoint")
	defer response.Body.Close()

	// unmarshalling the response
	responseBody := entities.Response{}
	json.NewDecoder(response.Body).Decode(&responseBody)

	// running assertions to make sure that our method does the correct thing
	suite.Equal(http.StatusCreated, response.StatusCode)
	suite.Equal(responseBody.Message, "Success to create tweet")
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *tweetHandlerSuite) TestGetAllTweets_Positive() {
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

	suite.usecase.On("GetAllTweets").Return(&tweets, nil)

	response, err := http.Get(fmt.Sprintf("%s/tweet", suite.testingServer.URL))
	suite.NoError(err, "no error when calling this endpoint")
	defer response.Body.Close()

	responseBody := entities.Response{}
	json.NewDecoder(response.Body).Decode(&responseBody)

	suite.Equal(http.StatusOK, response.StatusCode)
	suite.Equal(responseBody.Message, "Success to get all tweets")
	suite.usecase.AssertExpectations(suite.T())
}

func (suite *tweetHandlerSuite) TestGetTweetByID_Positive() {
	id := 1
	tweet := entities.Tweet{
		Username: "username",
		Text:     "text",
	}

	suite.usecase.On("GetTweetByID", id).Return(&tweet, nil)
	response, err := http.Get(fmt.Sprintf("%s/tweet/%d", suite.testingServer.URL, id))
	suite.NoError(err, "no error when calling this endpoint")
	defer response.Body.Close()

	responseBody := entities.Response{}
	json.NewDecoder(response.Body).Decode(&responseBody)

	suite.Equal(http.StatusOK, response.StatusCode)
	suite.Equal(responseBody.Message, fmt.Sprintf("Success to get tweet with id %d", id))
	suite.usecase.AssertExpectations(suite.T())
}

func TestTweetHandler(t *testing.T) {
	suite.Run(t, new(tweetHandlerSuite))
}
