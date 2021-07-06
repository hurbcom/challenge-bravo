package main

import (
    "github.com/MA-Andrade/challenge-bravo/internals/models"
    "github.com/MA-Andrade/challenge-bravo/internals/router"
    "github.com/gofiber/fiber/v2"
    "log"
    "os"
    "os/signal"
    "syscall"
)

func main() {
    var err error
    models.InitializeDB()
    app := fiber.New()
    // exit point
    idleConnsClosed := make(chan struct{})
    go func() {
        sigint := make(chan os.Signal)
        signal.Notify(sigint, os.Interrupt, syscall.SIGTERM)
        <-sigint

        models.CloseDB()

        if err = app.Shutdown(); err != nil {
            log.Println(err.Error())
        }

        log.Println("Application exited successfully")
        close(idleConnsClosed)
    } ()
    /*
    db, err := database.InitializeConnection()
    if err != nil {
        log.Println("error on initializing the connection: ", err.Error())
        os.Exit(1)
    }
    defer db.Close()
     */
    // setuping the application routes
    router.SetupRoutes(app)
    // serving the app
    if err = app.Listen(":5000"); err != nil {
        panic(err.Error())
    }

    <-idleConnsClosed
}