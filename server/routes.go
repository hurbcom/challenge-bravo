package server

import (
	"github.com/gofiber/fiber/v2"
)

// createRoutes for the application
func createRoutes(app *fiber.App) {

	api := app.Group("/api") // /api
	v1 := api.Group("/v1")   // /api/v1

	currency := v1.Group("/currency") // /api/v1/currency
	createCurrencyRoutes(currency)

	convert := v1.Group("/convert") // /api/v1/convert
	createConvertRoutes(convert)

	// Serve static files (frontend)
	app.Static("/", "./static", fiber.Static{Compress: true})
}

// createCurrencyRoutes create routes for currency CRUD
func createCurrencyRoutes(currency fiber.Router) {

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

// createConvertRoutes create routes for currency conversion
func createConvertRoutes(convert fiber.Router) {

	// Make a currency conversion
	convert.Get("/", Convert)
}
