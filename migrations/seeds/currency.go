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
	if found, _ := seed.currencyUsecase.GetCurrencyByKey(key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "USD description",
			ExchangeApi: true,
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}

	key = "BRL"
	if found, _ := seed.currencyUsecase.GetCurrencyByKey(key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "BRL description",
			ExchangeApi: true,
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}

	key = "EUR"
	if found, _ := seed.currencyUsecase.GetCurrencyByKey(key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "EUR description",
			ExchangeApi: true,
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}

	key = "BTC"
	if found, _ := seed.currencyUsecase.GetCurrencyByKey(key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "BTC description",
			ExchangeApi: true,
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}

	key = "ETH"
	if found, _ := seed.currencyUsecase.GetCurrencyByKey(key); found == nil {
		currency := models.Currency{
			Key:         key,
			Description: "ETH description",
			ExchangeApi: true,
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}

	key = "HURB"
	if found, _ := seed.currencyUsecase.GetCurrencyByKey(key); found == nil {
		currency := models.Currency{
			Key:            key,
			Description:    "HURB description",
			ExchangeApi:    false,
			CustomAmount:   99,
			CustomCurrency: "BRL",
		}
		seed.currencyUsecase.CreateCurrency(&currency)
	}
}
