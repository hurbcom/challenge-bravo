package main

import (
	"api/connections"
	"api/router"
	"fmt"
	"log"
	"time"

	"api/middleware"
	"api/services"
	"net/http"

	"github.com/urfave/negroni"
)

const port = 9092

var (
	mysqlconnectimeout = 10 * time.Second
	syncinterval       = 2 * time.Minute
	startsync          = false
)

// Start databases, handlers and sync service
func main() {
	// Try connect MySQL database in interval
	database, err := connections.OpenMysqlDB("mysql", "usr_database:123Mudar!@tcp(mysql:3306)/exchange_rate?collation=utf8_general_ci&parseTime=true", mysqlconnectimeout)
	if err != nil {
		log.Println(err)
	}

	defer database.Close()

	router.MySql = database
	// Connect redis database
	router.Redis = connections.OpenRedis()

	// Sync service execute in interval if enable
	if startsync {
		go services.StartSync(router.MySql, syncinterval, router.Redis)
	}

	mw := negroni.Classic()
	mw.Use(&middleware.WrappedError{})
	mw.UseHandler(router.Serve())

	// Our application will run on port 9092. Here we declare the port and pass in our router.
	http.ListenAndServe(fmt.Sprintf(":%d", port), mw)
}
