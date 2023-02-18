package route

import (
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/controller"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/handler"
)

func CurrencyRoute(handlerRouter handler.Router) {
	currencyController := controller.NewCurrency()

	handlerRouter.Get("/currency", currencyController.List)
	handlerRouter.Get("/currency/{id}", currencyController.Get)
	handlerRouter.Post("/currency", currencyController.Insert)
	handlerRouter.Put("/currency/{id}", currencyController.Update)
	handlerRouter.Delete("/currency/{id}", currencyController.Delete)
}
