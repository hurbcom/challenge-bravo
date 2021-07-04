package router


import (
    "github.com/MA-Andrade/challenge-bravo/internals/handlers"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/logger"
)

func SetupRoutes (app *fiber.App) {
    api := app.Group("/api", logger.New())

    api.Get("/currency", handlers.GetCurrencies)

    api.Post("/currency/new", handlers.PostCurrency)
    api.Get("/currency/:id", handlers.GetCurrency)
    api.Put("/currency/:id", handlers.PutCurrency)
    api.Delete("/currency/:id", handlers.DeleteCurrency)
}
