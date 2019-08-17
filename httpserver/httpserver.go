package httpserver

import (
	"log"
	"net/http"

	"github.com/tmcb/challenge-bravo/resthandler"
)

/*
HTTPServer listens and serves a currency converter REST API at the endpoint
specified by addr.
*/
func HTTPServer(addr string) {
	handler := resthandler.New()
	log.Fatal(http.ListenAndServe(addr, handler))
}
