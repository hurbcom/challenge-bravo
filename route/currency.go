package route

import (
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/controller"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/router"
)

func CurrencyRoute(appRouter router.Router) {
	currencyController := controller.NewCurrency()

	appRouter.Get("/currency", currencyController.List)
	appRouter.Get("/currency/convert", currencyController.Convert)
	appRouter.Get("/currency/{id}", currencyController.Get)

	appRouter.Post("/currency", currencyController.Insert)
	appRouter.Put("/currency/{id}", currencyController.Update)
	appRouter.Delete("/currency/{id}", currencyController.Delete)
}
