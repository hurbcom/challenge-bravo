package worker

import (
	"github.com/labstack/gommon/log"
	"schonmann/challenge-bravo/config"
	"schonmann/challenge-bravo/keys"
	"schonmann/challenge-bravo/redis"
	"schonmann/challenge-bravo/worker/external"
	"time"
)

func getWorkerInterval(interval int64) time.Duration {
	if interval != 0 {
		return time.Second * time.Duration(interval)
	}
	return time.Minute * 30
}

func StartWorker() {
	workerConfig := config.Get().Worker
	intervalTime := getWorkerInterval(workerConfig.UpdateInterval)

	for {
		strategy := external.GetRetrieveRatesStrategy()
		response, err := strategy.RetrieveRates()

		if err != nil {
			log.Fatalf("Error getting/parsing json from external API: %v", err)
			time.Sleep(intervalTime)
			continue
		}

		log.Infof("Keys to be set: %v", response.Rates)

		newQuotas := make([]interface{}, 0)

		for currency, quota := range response.Rates {
			newQuotas = append(newQuotas, keys.QuotaKey(currency), quota)
		}

		if _, err := redis.MSet(newQuotas...); err != nil {
			log.Fatalf("Error setting new rates from external API: %v", err)
		}

		time.Sleep(intervalTime)
	}
}
