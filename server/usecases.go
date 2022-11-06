package server

import usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"

type Usecases struct {
	TweetUsecase usecases.TweetUsecase
}

func SetupUsecases(repos *Repositories) *Usecases {
	tweetUsecase := usecases.InitializeTweetUsecase(repos.TweetRepository)

	return &Usecases{
		TweetUsecase: tweetUsecase,
	}
}
