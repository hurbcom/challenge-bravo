package main

import (
    "github.com/MA-Andrade/challenge-bravo/internals/db"
    "github.com/MA-Andrade/challenge-bravo/internals/router"
    "github.com/gofiber/fiber/v2"
    "log"
)

func main() {
    app := fiber.New()

    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Hello, World 👋!")
    })
    log.Println("Initializing DB")
    db.Initialize()

    router.SetupRoutes(app)

    app.Listen(":5000")
}