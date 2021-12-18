package server

import "github.com/gofiber/fiber/v2"

func createRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello")
	})
}
