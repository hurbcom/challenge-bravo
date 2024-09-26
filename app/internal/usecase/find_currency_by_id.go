package usecase

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
)

type FindCurrencyByIdUseCase struct {
	repository entity.CurrencyRepository
}

func (u FindCurrencyByIdUseCase) Execute(c context.Context, id int) *entity.Currency {
	currency, err := u.repository.FindOneById(c, id)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	return currency
}

func NewFindCurrencyByIdUseCase(repository entity.CurrencyRepository) FindCurrencyByIdUseCase {
	return FindCurrencyByIdUseCase{
		repository: repository,
	}
}
