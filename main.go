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
    // testing the connection
    log.Println("Initializing DB")
    db, err := database.InitializeConnection()
    if err != nil {
        log.Println("error on initializing the connection: ", err.Error())
        os.Exit(1)
    }
    defer db.Close()
    // setuping the application routes
    router.SetupRoutes(app)
    // serving the app
    app.Listen(":5000")
}