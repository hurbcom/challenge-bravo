package usecases

import (
	"errors"
	"net/http"
	"time"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	repositories "github.com/felipepnascimento/challenge-bravo-flp/repositories"
)

type tweetUsecase struct {
	tweetRepository repositories.TweetRepository
}

type TweetUsecase interface {
	GetAllTweets() (*[]entities.Tweet, error)
	GetTweetByID(id int) (*entities.Tweet, error)
	SearchTweetByText(text string) (*[]entities.Tweet, error)
	CreateTweet(tweet *entities.Tweet) error
	UpdateTweet(tweet *entities.Tweet) error
	DeleteTweet(id int) error
}

func InitializeTweetUsecase(repository repositories.TweetRepository) TweetUsecase {
	return &tweetUsecase{repository}
}

func (usecase *tweetUsecase) GetAllTweets() (*[]entities.Tweet, error) {
	return usecase.tweetRepository.GetAllTweets()
}

func (usecase *tweetUsecase) GetTweetByID(id int) (*entities.Tweet, error) {
	tweet, _ := usecase.tweetRepository.GetTweetByID(id)
	if tweet == nil {
		return nil, &entities.AppError{
			Err:        errors.New("tweet is not found"),
			StatusCode: http.StatusNotFound,
		}
	}
	return tweet, nil
}

func (usecase *tweetUsecase) SearchTweetByText(text string) (*[]entities.Tweet, error) {
	return usecase.tweetRepository.SearchTweetByText("%" + text + "%")
}

func (usecase *tweetUsecase) CreateTweet(tweet *entities.Tweet) error {
	if tweet == nil {
		return &entities.AppError{
			Err:        errors.New("tweet is nil pointer"),
			StatusCode: http.StatusInternalServerError,
		}
	}

	if !tweet.IsValid() {
		return &entities.AppError{
			Err:        errors.New("username and text cannot be empty"),
			StatusCode: http.StatusBadRequest,
		}
	}
	err := usecase.tweetRepository.CreateTweet(tweet)
	if err != nil {
		return &entities.AppError{
			Err:        err,
			StatusCode: http.StatusInternalServerError,
		}
	}
	return nil
}

func (usecase *tweetUsecase) UpdateTweet(tweet *entities.Tweet) error {
	tweet.ModifiedAt = time.Now()
	err := usecase.tweetRepository.UpdateTweet(tweet)
	return err
}

func (usecase *tweetUsecase) DeleteTweet(id int) error {
	return usecase.tweetRepository.DeleteTweet(id)
}
