package utils

import (
	"net/http"
)

//HTTPResponse defines the request status code and returns a JSON string
func HTTPResponse(w http.ResponseWriter, status int, content string, data bool) {
	w.WriteHeader(status)
	w.Header().Set("Content-Type", "application/json")
	if data {
		w.Write([]byte(GenericJSONMessageData(status, content)))
	} else {
		w.Write([]byte(GenericJSONMessage(status, content)))
	}
}
