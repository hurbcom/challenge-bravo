package server

import "github.com/gofiber/fiber/v2"

// createRoutes for the application
func createRoutes(app *fiber.App) {

	api := app.Group("/api") // /api
	v1 := api.Group("/v1")   // /api/v1

	currency := v1.Group("/currency") // /api/v1/currency
	createCurrencyRoutes(currency)

	quote := v1.Group("/quote") // /api/v1/quote
	createQuoteRoutes(quote)
}

// createCurrencyRoutes create routes for currency CRUD
func createCurrencyRoutes(currency fiber.Router) {

	currency.Options("/", HelpCurrency)

	// New custom currency
	currency.Post("/", NewCurrency)

	// Reads a single currency or list of all currencies
	currency.Get("/:symbol?", GetCurrency)

	// Update a custom currency
	currency.Put("/:symbol", UpdateCurrency)
	currency.Patch("/:symbol", UpdateCurrency)

	// Delete a custom currency
	currency.Delete("/:symbol", DeleteCurrency)

}

// createQuoteRoutes create routes for currency quotation
func createQuoteRoutes(quote fiber.Router) {
	// TODO: quote
	quote.Get("/:symbol?", func(c *fiber.Ctx) error {
		return c.SendString("Hello")
	})
}
