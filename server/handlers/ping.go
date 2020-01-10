package handlers

import (
	"challenge-bravo/utils"
	"net/http"
)

//Ping is a route for testing API
func Ping(w http.ResponseWriter, r *http.Request) {
	utils.HTTPResponse(w, http.StatusOK, "Pong", false)
	return
}
