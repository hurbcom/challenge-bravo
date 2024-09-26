package testutils

import (
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/currency_repository"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/user_repository"
)

func beforeEach() {
	currency_repository.New()
	user_repository.New()
}
