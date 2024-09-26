package usecase

import (
	"context"
	"strings"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/cache_keys"
	aredis "github.com/wesleyfebarretos/challenge-bravo/pkg/redis"
)

type CreateCurrencyUseCase struct {
	repository entity.CurrencyRepository
}

func (u CreateCurrencyUseCase) Execute(c context.Context, p entity.Currency, userID int) entity.Currency {
	p.CreatedBy = userID
	p.UpdatedBy = userID

	p.Code = strings.ToUpper(p.Code)

	if p.CountryCode != nil {
		toUpper := strings.ToUpper(*p.CountryCode)
		p.CountryCode = &toUpper
	}

	currency, err := u.repository.Create(c, p)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	currencyRateMap := map[string]float64{}

	aredis.Get(c, cache_keys.CURRENCIES_RATE_MAP, &currencyRateMap)

	currencyRateMap[p.Code] = p.USDExchangeRate

	aredis.Set(c, cache_keys.CURRENCIES_RATE_MAP, currencyRateMap, 0)

	return currency
}

func NewCreateCurrencyUseCase(repository entity.CurrencyRepository) CreateCurrencyUseCase {
	return CreateCurrencyUseCase{
		repository: repository,
	}
}
