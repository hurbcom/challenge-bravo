package gateway

import (
	"github.com/VictorNapoles/challenge-bravo/gateway/awesomeapi"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
	"github.com/VictorNapoles/challenge-bravo/infra"
	"regexp"
	"strings"
)

const (
	InitialCurrenciesEnvVar = "INITIAL_CURRENCIES"
	BankCurrencyCodeEnvVar  = "BANK_CURRENCY_CODE"
)

var (
	awesomeApiClient   awesomeapi.AwesomeApiClient
	currencyRepository repository.CurrencyRepository
	quoteRepository    repository.QuoteRepository
)

func loadAwesomeApiClient() {
	awesomeApiClient = awesomeapi.NewAwesomeApiClient(infra.GetHttpClient(), infra.GetEnvironment())
}

func loadCurrencyRepository() {
	databaseName, err := infra.GetDatabaseName()
	if err != nil {
		return
	}
	currencyRepository = repository.NewCurrencyRepository(infra.GetMongoDatabaseConnection(), infra.GetRedisCacheConnection(), databaseName)
}

func loadQuoteRepository() {
	quoteRepository = repository.NewQuoteRepository(infra.GetRedisCacheConnection())
}

func loadInitialData() {
	bankCurrencyCode, err := infra.GetEnvironment().Get(BankCurrencyCodeEnvVar)
	if err != nil {
		panic(err.Error())
	}

	loadAvailableQuotes(bankCurrencyCode)
	loadInitialCurrencies(bankCurrencyCode)
}

func loadInitialCurrencies(bankCurrencyCode string) {

	availableCurrencies, err := GetAwesomeApiClient().GetAvailableCurrencies()
	if err != nil {
		panic(err.Error())
	}
	initialCurrencies, err := infra.GetEnvironment().Get(InitialCurrenciesEnvVar)
	if err != nil {
		panic(err.Error())
	}

	currencies := regexp.MustCompile(`,`).Split(initialCurrencies, -1)
	for _, code := range currencies {

		currencyEntity, err := GetCurrencyRepository().GetByCode(code)
		if err != nil {
			panic(err.Error())
		}
		if currencyEntity.Code == "" {
			currencyName := availableCurrencies[code]

			var entity *repository.CurrencyEntity
			if code == bankCurrencyCode {
				entity = &repository.CurrencyEntity{
					CurrencyName:          availableCurrencies[code],
					Code:                  code,
					QuoteType:             repository.QuoteNotAvailable,
					UnitValueBankCurrency: 1,
					Deletable:             false,
				}
			} else {
				availableQuote, err := GetQuoteRepository().CheckIsAvailableQuote(code, bankCurrencyCode)
				if err != nil {
					panic(err.Error())
				}

				var quoteType repository.QuoteTypeEntity

				if availableQuote {
					quoteType = repository.QuoteToBankCurrency
				} else {
					quoteType = repository.QuoteFromBankCurrency
				}

				entity = &repository.CurrencyEntity{
					CurrencyName: currencyName,
					Code:         code,
					QuoteType:    quoteType,
					Deletable:    false,
				}

			}
			GetCurrencyRepository().Save(entity)
		}
	}
}

func loadAvailableQuotes(bankCurrencyCode string) {
	quotes, err := GetAwesomeApiClient().GetAvailableQuotes()
	if err != nil {
		panic(err.Error())
	}

	for key, _ := range quotes {
		if strings.HasSuffix(key, bankCurrencyCode) || strings.HasPrefix(key, bankCurrencyCode) {
			currencyCodes := regexp.MustCompile(`-`).Split(key, -1)
			err := GetQuoteRepository().SetAvailableQuote(currencyCodes[0], currencyCodes[1])
			if err != nil {
				panic(err.Error())
			}
		}
	}
}

func LoadGateways() {
	loadAwesomeApiClient()
	loadCurrencyRepository()
	loadQuoteRepository()
	loadInitialData()
}

func GetAwesomeApiClient() awesomeapi.AwesomeApiClient {
	if awesomeApiClient == nil {
		loadAwesomeApiClient()
	}
	return awesomeApiClient
}

func GetCurrencyRepository() repository.CurrencyRepository {
	if currencyRepository == nil {
		loadCurrencyRepository()
	}
	return currencyRepository
}

func GetQuoteRepository() repository.QuoteRepository {
	if quoteRepository == nil {
		loadQuoteRepository()
	}
	return quoteRepository
}
