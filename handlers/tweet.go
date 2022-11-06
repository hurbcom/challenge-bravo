package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"
	"github.com/gin-gonic/gin"
)

type tweetHandler struct {
	tweetUsecase usecases.TweetUsecase
}

type TweetHandler interface {
	GetAllTweets(ctx *gin.Context) *entities.AppResult
	GetTweetByID(ctx *gin.Context) *entities.AppResult
	SearchTweetByText(ctx *gin.Context) *entities.AppResult
	CreateTweet(ctx *gin.Context) *entities.AppResult
	UpdateTweet(ctx *gin.Context) *entities.AppResult
	DeleteTweet(ctx *gin.Context) *entities.AppResult
}

func InitializeTweetHandler(usecase usecases.TweetUsecase) TweetHandler {
	return &tweetHandler{usecase}
}

func (handler *tweetHandler) GetAllTweets(*gin.Context) *entities.AppResult {
	var result entities.AppResult

	tweets, err := handler.tweetUsecase.GetAllTweets()
	if err == nil {
		result.StatusCode = http.StatusOK
		result.Message = "Success to get all tweets"
		if len(*tweets) == 0 {
			result.Data = []struct{}{}
		} else {
			result.Data = tweets
		}
	} else {
		result.StatusCode = http.StatusInternalServerError
		result.Err = err
		result.Data = []struct{}{}
	}

	return &result
}

func (handler *tweetHandler) GetTweetByID(ctx *gin.Context) *entities.AppResult {
	var result entities.AppResult
	id, err := strconv.Atoi(ctx.Param("id"))

	tweet, err := handler.tweetUsecase.GetTweetByID(id)
	if err == nil {
		result.StatusCode = http.StatusOK
		result.Message = fmt.Sprintf("Success to get tweet with id %d", id)
		if tweet == nil {
			result.Data = struct{}{}
		} else {
			result.Data = tweet
		}
	} else {
		fmt.Println()
		result.StatusCode = err.(*entities.AppError).StatusCode
		result.Err = err.(*entities.AppError).Err
		result.Data = struct{}{}
	}

	return &result
}

func (handler *tweetHandler) SearchTweetByText(ctx *gin.Context) *entities.AppResult {
	searchParam := ctx.Query("search")
	var result entities.AppResult

	tweets, err := handler.tweetUsecase.SearchTweetByText(searchParam)
	if err == nil {
		result.StatusCode = http.StatusOK
		if len(*tweets) == 0 {
			result.Message = fmt.Sprintf("No tweets found with a searching keyword %s", searchParam)
			result.Data = []struct{}{}
		} else {
			result.Message = fmt.Sprintf("Success to get all tweets with a searching keyword %s", searchParam)
			result.Data = tweets
		}
	} else {
		result.StatusCode = http.StatusInternalServerError
		result.Err = err
		result.Data = []struct{}{}
	}

	return &result
}

func (handler *tweetHandler) CreateTweet(ctx *gin.Context) *entities.AppResult {
	var tweet entities.Tweet
	var result entities.AppResult

	if err := ctx.ShouldBindJSON(&tweet); err != nil {
		result.Err = err
		result.Message = "username and text can not be empty"
		result.StatusCode = http.StatusBadRequest
		return &result
	}

	err := handler.tweetUsecase.CreateTweet(&tweet)
	if err == nil {
		result.Message = "Success to create tweet"
		result.StatusCode = http.StatusCreated
	} else {
		result.Err = err.(*entities.AppError).Err
		result.Message = err.(*entities.AppError).Error()
		result.StatusCode = err.(*entities.AppError).StatusCode
	}

	return &result
}

func (handler *tweetHandler) UpdateTweet(ctx *gin.Context) *entities.AppResult {
	var tweet entities.Tweet
	var result entities.AppResult

	if err := ctx.ShouldBindJSON(&tweet); err != nil {
		result.Err = err
		result.Message = "username and text can not be empty"
		result.StatusCode = http.StatusBadRequest
		return &result
	}

	err := handler.tweetUsecase.UpdateTweet(&tweet)
	if err == nil {
		result.Message = fmt.Sprintf("Success to update tweet with id %d", tweet.ID)
		result.StatusCode = http.StatusAccepted
	} else {
		result.Err = err.(*entities.AppError).Err
		result.Message = err.(*entities.AppError).Error()
		result.StatusCode = err.(*entities.AppError).StatusCode
	}

	return &result
}

func (handler *tweetHandler) DeleteTweet(ctx *gin.Context) *entities.AppResult {
	var result entities.AppResult

	id, err := strconv.Atoi(ctx.Param("id"))

	err = handler.tweetUsecase.DeleteTweet(id)
	if err == nil {
		result.Message = fmt.Sprintf("Success to delete tweet with id %d", id)
		result.StatusCode = http.StatusAccepted
	} else {
		result.Err = err.(*entities.AppError).Err
		result.Message = err.(*entities.AppError).Error()
		result.StatusCode = err.(*entities.AppError).StatusCode
	}

	return &result
}
