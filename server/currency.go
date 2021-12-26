package server

import (
	"challenge-bravo/model"
	"challenge-bravo/model/dao"
	"github.com/gofiber/fiber/v2"
)

func HelpCurrency(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"Ok": "Ok"})
}

func NewCurrency(c *fiber.Ctx) error {

	// Marshal json body to struct
	var currency model.Currency
	if err := c.BodyParser(&currency); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dao.NewMultipleErrors(
			"Request body should be a JSON object, please use a OPTION request to obtain help", err))
	}

	// Force to be a custom currency
	currency.Type = model.CustomCurrency

	// Persist
	if err := currency.New(); err != nil {
		return c.Status(err.StatusCode).JSON(err)
	}

	return c.Status(fiber.StatusOK).JSON(currency)
}
