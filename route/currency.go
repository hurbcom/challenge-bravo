package route

import (
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/controller"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/router"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/usecase"
	"github.com/hashicorp/go-hclog"
)

func CurrencyRoute(appRouter router.Router, log hclog.Logger, repository repository.Repository, cache cache.Cache) {
	repositoryCurrency := repository.Currency()
	cacheCurrency := cache.Currency()
	usecaseCurrency := usecase.NewCurrency(repositoryCurrency, cacheCurrency)
	currencyController := controller.NewCurrency(log, usecaseCurrency)

	appRouter.Get("/currency", currencyController.List)
	appRouter.Get("/currency/convert", currencyController.Convert)
	appRouter.Get("/currency/{id}", currencyController.GetByID)

	appRouter.Post("/currency", currencyController.Insert)
	appRouter.Put("/currency/{id}", currencyController.Update)
	appRouter.Delete("/currency/{id}", currencyController.Delete)
}
