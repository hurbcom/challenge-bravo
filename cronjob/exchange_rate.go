package cronjob

import (
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/usecase"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/util"
	"github.com/go-co-op/gocron"
	"github.com/hashicorp/go-hclog"
)

func ExchangeRate(config *util.Config, log hclog.Logger, repositoryCurrency repository.Currency,
	cacheCurrency cache.Currency, cacheExchangeRate cache.ExchangeRate) {
	scheduler := gocron.NewScheduler(time.UTC)

	// err := usecase.NewExchangeRate(config, log, repositoryCurrency, cacheCurrency)

	// if err != nil {
	// 	log.Warn("Error Loading Exchange Rates", "error", err)
	// }

	scheduler.Every(5).Minutes().Do(func() {

		err := usecase.NewExchangeRate(config, log, repositoryCurrency, cacheCurrency, cacheExchangeRate)

		if err != nil {
			log.Warn("Error Loading Exchange Rates", "error", err)
		}
	})

	scheduler.StartAsync()
}
