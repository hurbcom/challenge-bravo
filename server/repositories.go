package server

import (
	repositories "github.com/felipepnascimento/challenge-bravo-flp/repositories"
	"github.com/jmoiron/sqlx"
)

type Repositories struct {
	TweetRepository repositories.TweetRepository
}

func SetupRepositories(db *sqlx.DB) *Repositories {
	tweetRepository := repositories.InitializeTweetRepository(db)

	return &Repositories{
		TweetRepository: tweetRepository,
	}
}
