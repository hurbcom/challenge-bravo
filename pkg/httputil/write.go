package httputil

import (
	"encoding/json"
	"log"
	"net/http"
)

func WriteJSON(w http.ResponseWriter, httpStatusCode int, body interface{}) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(httpStatusCode)

	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
	}
}
