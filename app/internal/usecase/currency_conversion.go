package usecase

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/cache_keys"
	aredis "github.com/wesleyfebarretos/challenge-bravo/pkg/redis"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/utils"
)

type CurrencyConversionUseCase struct{}

type CurrencyConversionDTO struct {
	Label string
	Value float64
}

func (u CurrencyConversionUseCase) Execute(c *gin.Context, from, to string, amount float64) CurrencyConversionDTO {
	from = strings.ToUpper(from)
	to = strings.ToUpper(to)

	currencyRateMap := map[string]float64{}

	aredis.Get(c, cache_keys.CURRENCIES_RATE_MAP, &currencyRateMap)

	fromBaseRate, ok := currencyRateMap[from]
	if !ok {
		panic(exception.BadRequest(fmt.Sprintf("[from=%s] currency not found", strings.ToLower(from))))
	}

	toBaseRate, ok := currencyRateMap[to]
	if !ok {
		panic(exception.BadRequest(fmt.Sprintf("[to=%s] currency not found", strings.ToLower(to))))
	}

	convertedValue := utils.RoundFloat((fromBaseRate/toBaseRate)*amount, 2)

	return CurrencyConversionDTO{
		Label: fmt.Sprintf("%.2f %s", convertedValue, to),
		Value: convertedValue,
	}
}

func NewCurrencyConversionUseCase() CurrencyConversionUseCase {
	return CurrencyConversionUseCase{}
}
