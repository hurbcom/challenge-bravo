package route

import (
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/controller"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/router"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	"github.com/hashicorp/go-hclog"
)

func HealthzRoute(appRouter router.Router, log hclog.Logger, repository repository.Repository, cache cache.Cache) {
	healthzController := controller.NewHealthz(log, repository, cache)

	appRouter.Get("/healthz", healthzController.Check)
}
