package seeds

import (
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"
)

type currencySeed struct {
	currencyUsecase usecases.CurrencyUsecase
}

type CurrencySeed interface {
	SeedInitialCurrency()
}

func InitializeCurrencySeed(usecase usecases.CurrencyUsecase) CurrencySeed {
	return &currencySeed{usecase}
}

func (seed *currencySeed) SeedInitialCurrency() {
	key := "USD"
	if found, _ := seed.currencyUsecase.GetCurrencyBy("key", key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "USD description",
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}

	key = "BRL"
	if found, _ := seed.currencyUsecase.GetCurrencyBy("key", key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "BRL description",
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}

	key = "EUR"
	if found, _ := seed.currencyUsecase.GetCurrencyBy("key", key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "EUR description",
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}

	key = "BTC"
	if found, _ := seed.currencyUsecase.GetCurrencyBy("key", key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "BTC description",
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}

	key = "ETH"
	if found, _ := seed.currencyUsecase.GetCurrencyBy("key", key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "ETH description",
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}
}
