package server

import (
	"challenge-bravo/model"
	"github.com/gofiber/fiber/v2"
	"strings"
)

// NewCurrency Creates a new currency
func NewCurrency(c *fiber.Ctx) error {

	// Marshal json body to struct
	var currency model.Currency
	if err := c.BodyParser(&currency); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.NewMultipleErrors(
			"request body should be a JSON object", err))
	}

	// Force to be a custom currency
	currency.Type = model.CustomCurrency

	// Persist
	if err := currency.New(); err != nil {
		return c.Status(err.StatusCode).JSON(err)
	}

	return c.Status(fiber.StatusOK).JSON(currency)
}

// UpdateCurrency Updates a custom currency
func UpdateCurrency(c *fiber.Ctx) error {

	// Marshal json body to struct
	var currency model.Currency
	if err := c.BodyParser(&currency); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.NewMultipleErrors(
			"request body should be a JSON object", err))
	}

	// Get currency code from URL
	if currency.Code != strings.ToUpper(strings.TrimSpace(c.Params("symbol", ""))) {
		return c.Status(fiber.StatusForbidden).JSON(model.Error{Message: "currency code cannot be modified, please delete and create a new one"})
	}

	// Load currency from database/cache
	dbCurrency := model.Currency{Code: currency.Code}
	if err := dbCurrency.Load(); err != nil {
		return c.Status(err.StatusCode).JSON(err)
	}

	// Check if the currency is a custom currency
	if dbCurrency.Type != model.CustomCurrency {
		return c.Status(fiber.StatusForbidden).JSON(model.Error{Message: "only custom currencies can be modified"})
	}

	// Force to be a custom currency
	currency.Type = model.CustomCurrency

	// Save edits
	if err := currency.Save(); err != nil {
		return c.Status(err.StatusCode).JSON(err)
	}

	return c.Status(fiber.StatusOK).JSON(currency)
}

func DeleteCurrency(c *fiber.Ctx) error {

	// Creates currency entity using path parameter
	currency := model.Currency{
		Code: strings.ToUpper(strings.TrimSpace(c.Params("symbol", ""))),
	}

	// Load the currency from cache/database
	if err := currency.Load(); err != nil {
		return c.Status(err.StatusCode).JSON(err)
	}

	// Only allow delete custom currencies
	if currency.Type != model.CustomCurrency {
		return c.Status(fiber.StatusForbidden).JSON(model.Error{Message: "only custom currencies can be deleted"})
	}

	// Delete currency entity
	if err := currency.Delete(); err != nil {
		return c.Status(err.StatusCode).JSON(err)
	}

	// Returns success
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

// GetCurrency Reads a single or a currency list
func GetCurrency(c *fiber.Ctx) error {

	// Creates currency entity using path parameter
	currency := model.Currency{
		Code: strings.ToUpper(strings.TrimSpace(c.Params("symbol", ""))),
	}

	// If is an empty currency code list all entities else get the supplied currency
	var err *model.Error
	if currency.Code != "" {
		err = currency.Load()
		if err == nil {
			return c.Status(fiber.StatusOK).JSON(currency)
		}
	} else {
		var currencies []*model.Currency
		err = currency.List(&currencies)
		if err == nil {
			return c.Status(fiber.StatusOK).JSON(currencies)
		}
	}
	return c.Status(err.StatusCode).JSON(err)
}
