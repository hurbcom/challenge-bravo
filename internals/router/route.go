package router


import (
    "github.com/MA-Andrade/challenge-bravo/internals/handlers"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/logger"
)

func SetupRoutes (app *fiber.App) {
    log := logger.New()
    // Currency handling group and routes
    apiCurrency := app.Group("/api/currency", log)

    apiCurrency.Get("/", handlers.GetCurrencies)
    apiCurrency.Post("/new", handlers.PostCurrency)
    apiCurrency.Get("/:symbol", handlers.GetCurrencyFromSymbol)
    apiCurrency.Put("/:symbol", handlers.PutCurrencyFromSymbol)
    apiCurrency.Delete("/:symbol", handlers.DeleteCurrencyFromSymbol)

    // Conversion handling group and routes
    apiConvert := app.Group("/api/convert", log)

    apiConvert.Get("/:from-:to-:value", handlers.GetConversion)
}
