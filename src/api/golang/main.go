package main

import (
    "log"
	"net/http"
	"time"
)

func main() {
	router := NewRouter()
	srv := &http.Server{
        Handler:      router,
        Addr:         ":8000",
        // Good practice: enforce timeouts for servers!
        WriteTimeout: 15 * time.Second,
        ReadTimeout:  15 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}