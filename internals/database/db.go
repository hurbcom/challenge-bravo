package database

import (
    "database/sql"
    "fmt"
    _ "github.com/lib/pq"
    "log"
    "os"
    "strconv"
)

func InitializeConnection() (*sql.DB, error) {
    // fetch the url
    connStr := GetDatabaseURL()
    // establish the connection
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Println("Unable to connect to database : ", err)
        return nil, err
    }

    // ping the conn
    err = db.Ping()
    if err != nil {
        log.Println("Error on ping: ", err)
        defer db.Close()
        return nil, fmt.Errorf("error on ping, %w", err)
    }

    return db, nil
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
