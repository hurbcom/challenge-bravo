package gateway

import (
	"github.com/VictorNapoles/challenge-bravo/gateway/awesomeapi"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
	"github.com/VictorNapoles/challenge-bravo/infra"
)

var (
	awesomeApiClient   awesomeapi.AwesomeApiClient
	currencyRepository repository.CurrencyRepository
	quoteRepository repository.QuoteRepository
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

func LoadGateways() {
	loadAwesomeApiClient()
	loadCurrencyRepository()
    loadQuoteRepository()
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
