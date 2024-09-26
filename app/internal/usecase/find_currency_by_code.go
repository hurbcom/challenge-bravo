package usecase

import (
	"context"
	"strings"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
)

type FindCurrencyByCodeUseCase struct {
	repository entity.CurrencyRepository
}

func (u FindCurrencyByCodeUseCase) Execute(c context.Context, code string) *entity.Currency {
	upperCode := strings.ToUpper(code)
	currency, err := u.repository.FindOneByCode(c, upperCode)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	return currency
}

func NewFindCurrencyByCodeUseCase(repository entity.CurrencyRepository) FindCurrencyByCodeUseCase {
	return FindCurrencyByCodeUseCase{
		repository: repository,
	}
}
