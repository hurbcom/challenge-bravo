package cronjobs

import (
	"time"

	"github.com/go-co-op/gocron"
)

type CurrencyController interface {
	UpdateAllUpdatableCurrencies()
}

type CurrencyCronJob struct {
	controller CurrencyController
}

func NewCurrencyCronJob(controller CurrencyController) *CurrencyCronJob {
	return &CurrencyCronJob{controller}
}

func (currencyCronJob CurrencyCronJob) Run() {
	cronjobScheduler := gocron.NewScheduler(time.UTC)

	cronjobScheduler.Every(15).Seconds().Do(currencyCronJob.controller.UpdateAllUpdatableCurrencies)

	cronjobScheduler.StartAsync()
}
