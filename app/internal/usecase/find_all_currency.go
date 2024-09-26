package usecase

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
)

type FindAllCurrencyUseCase struct {
	repository entity.CurrencyRepository
}

func (u FindAllCurrencyUseCase) Execute(c context.Context) []entity.Currency {
	currencies, err := u.repository.FindAll(c)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	return currencies
}

func NewFindAllCurrencyUseCase(repository entity.CurrencyRepository) FindAllCurrencyUseCase {
	return FindAllCurrencyUseCase{
		repository: repository,
	}
}
