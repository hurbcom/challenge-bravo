package gateway

import (
	"github.com/VictorNapoles/challenge-bravo/gateway/awesomeapi"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
	"github.com/VictorNapoles/challenge-bravo/infra"
)

var (
	awesomeApiClient awesomeapi.AwesomeApiClient
	priceRepository  repository.CurrencyRepository
)

func loadAwesomeApiClient() {
	awesomeApiClient = awesomeapi.NewAwesomeApiClient(infra.GetHttpClient(), infra.GetEnvironment())
}

func loadCurrencyRepository() {
	databaseName, err := infra.GetDatabaseName()
	if err != nil {
		return
	}
	priceRepository = repository.NewCurrencyRepository(infra.GetMongoDatabaseConnection(), infra.GetRedisCacheConnection(), databaseName)
}

func LoadGateways() {
	loadAwesomeApiClient()
	loadCurrencyRepository()
}

func GetAwesomeApiClient() awesomeapi.AwesomeApiClient {
	if awesomeApiClient == nil {
		loadAwesomeApiClient()
	}
	return awesomeApiClient
}
func GetCurrencyRepository() repository.CurrencyRepository {
	if priceRepository == nil {
		loadCurrencyRepository()
	}
	return priceRepository
}
