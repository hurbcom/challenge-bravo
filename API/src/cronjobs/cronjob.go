package cronjobs

import (
	"api/src/controllers"
	"time"

	"github.com/go-co-op/gocron"
)

func RunCronjob() {
	cronjobScheduler := gocron.NewScheduler(time.UTC)

	cronjobScheduler.Every(15).Seconds().Do(controllers.UpdateAllUpdatableCurrencies)

	cronjobScheduler.StartAsync()
}
