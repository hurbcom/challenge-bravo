package db

import (
    "database/sql"
    "fmt"
    "log"
    "os"
    "strconv"

    _ "github.com/lib/pq"
)

func Initialize() {
    // fetch the url
    connStr := GetDatabaseURL()
    // establish the connection
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Println("Unable to connect to database : ", err)
        os.Exit(1)
    }
    // defer close the conn, with error handling
    defer func() {
        err = db.Close()
        if err != nil {
            log.Println("Error on closing the connection: ", err)
        }
    } ()
    // ping the conn
    err = db.Ping()
    if err != nil {
        log.Println("Error on ping: ", err)
    }
    // success msg
    log.Println("Database connection test successful.")
}

func GetDatabaseURL() string {
    // Search for a env string to check
    port, err := strconv.Atoi(os.Getenv("DATABASE_PORT"))
    if err != nil {
        log.Println("Error on loading environmental variables from env:", err.Error())
        os.Exit(1)
    }
    // fmt the conn string
    url := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
        os.Getenv("DATABASE_HOST"),
        port,
        os.Getenv("DATABASE_USER"),
        os.Getenv("DATABASE_PASS"),
        os.Getenv("DATABASE_NAME"),
    )

    return url
}
