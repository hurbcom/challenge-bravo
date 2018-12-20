package worker

import (
	"schonmann/challenge-bravo/config"
	"time"
)

func StartWorker() {
	jobInterval := config.Get().Worker.UpdateInterval
	for {
		time.Sleep(time.Second * time.Duration(jobInterval))
	}
}
