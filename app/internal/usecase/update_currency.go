package usecase

import (
	"context"
	"strings"
	"time"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/cache_keys"
	aredis "github.com/wesleyfebarretos/challenge-bravo/pkg/redis"
)

type UpdateCurrencyUseCase struct {
	repository entity.CurrencyRepository
}

func (u UpdateCurrencyUseCase) Execute(c context.Context, p entity.Currency, id, userID int) {
	p.ID = id
	p.UpdatedAt = time.Now().UTC()
	p.UpdatedBy = userID

	p.Code = strings.ToUpper(p.Code)

	if p.CountryCode != nil {
		upperCountryCode := strings.ToUpper(*p.CountryCode)
		p.CountryCode = &upperCountryCode
	}

	err := u.repository.Update(c, p)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	currencyRateMap := map[string]float64{}

	aredis.Get(c, cache_keys.CURRENCIES_RATE_MAP, &currencyRateMap)

	currencyRateMap[p.Code] = p.USDExchangeRate

	aredis.Set(c, cache_keys.CURRENCIES_RATE_MAP, currencyRateMap, 0)
}

func NewUpdateCurrencyUseCase(repository entity.CurrencyRepository) UpdateCurrencyUseCase {
	return UpdateCurrencyUseCase{
		repository: repository,
	}
}
