package usecase

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
)

type DeleteCurrencyUseCase struct {
	repository entity.CurrencyRepository
}

func (u DeleteCurrencyUseCase) Execute(c context.Context, id int) {
	err := u.repository.Delete(c, id)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}
}

func NewDeleteCurrencyUseCase(repository entity.CurrencyRepository) DeleteCurrencyUseCase {
	return DeleteCurrencyUseCase{
		repository: repository,
	}
}
