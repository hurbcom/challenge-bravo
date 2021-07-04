package main

import (
    "github.com/MA-Andrade/challenge-bravo/internals/database"
    "github.com/MA-Andrade/challenge-bravo/internals/router"
    "github.com/gofiber/fiber/v2"
    "log"
    "os"
)

func main() {
    app := fiber.New()

    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Hello, World 👋!")
    })
    log.Println("Initializing DB")
    db, err := database.InitializeConnection()
    if err != nil {
        log.Println("error on initializing the connection: ", err.Error())
        os.Exit(1)
    }

    defer db.Close()


    router.SetupRoutes(app)

    app.Listen(":5000")
}