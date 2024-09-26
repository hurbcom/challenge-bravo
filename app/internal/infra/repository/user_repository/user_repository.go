package user_repository

import (
	"sync"

	"github.com/jackc/pgx/v5"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/config"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/db"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/sqlc/user_connection"
)

var (
	once       sync.Once
	repository *UserRepository
)

type UserRepository struct {
	queries *user_connection.Queries
}

func (u *UserRepository) renewTestTx() {
	u.queries = user_connection.New(db.GetConnection())
}

func (u UserRepository) WithTx(tx pgx.Tx) entity.UserRepository {
	return &UserRepository{
		queries: u.queries.WithTx(tx),
	}
}

func New() entity.UserRepository {

	once.Do(func() {
		repository = &UserRepository{
			queries: user_connection.New(db.GetConnection()),
		}
	})

	if config.Envs.AppEnv == enum.TEST_ENVIROMENT {
		repository.renewTestTx()
	}

	return repository
}
