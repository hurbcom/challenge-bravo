package server

import (
	handlers "github.com/felipepnascimento/challenge-bravo-flp/handlers"
)

type Handlers struct {
	TweetHandler handlers.TweetHandler
}

func SetupHandlers(uscs *Usecases) *Handlers {
	tweetHandlers := handlers.InitializeTweetHandler(uscs.TweetUsecase)

	return &Handlers{
		TweetHandler: tweetHandlers,
	}
}
