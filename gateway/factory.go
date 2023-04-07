package gateway

import (
    "github.com/VictorNapoles/challenge-bravo/gateway/awesomeapi"
    "github.com/VictorNapoles/challenge-bravo/gateway/repository"
    "github.com/VictorNapoles/challenge-bravo/infra"
)

var (
    awesomeApiClient awesomeapi.AwesomeApiClient
    priceRepository  repository.PriceRepository
)

func loadAwesomeApiClient() {
    awesomeApiClient = awesomeapi.NewAwesomeApiClient(infra.GetHttpClient(), infra.GetEnvironment())
}

func loadPriceRepository() {
    priceRepository = repository.NewPriceRepository(infra.GetDatabaseConnection(), infra.GetRedisCacheConnection())
}

func LoadGateways() {
    loadAwesomeApiClient()
}

func GetAwesomeApiClient() awesomeapi.AwesomeApiClient {
    return awesomeApiClient
}
