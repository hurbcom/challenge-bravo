package httpserver

import (
	"log"
	"net/http"
)

/*
HTTPServer listens and serves a currency converter REST API at the endpoint
specified by addr.
*/
func HTTPServer(addr string) {
	log.Fatal(http.ListenAndServe(addr, nil))
}
