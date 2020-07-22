package httputil

import (
	"encoding/json"
	"log"
	"net/http"
)

func WriteJSON(w http.ResponseWriter, httpStatusCode int, body interface{}) {
	w.WriteHeader(httpStatusCode)
	w.Header().Add("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
	}
}
