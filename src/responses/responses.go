package responses

import (
	"encoding/json"
	"log"
	"net/http"
)

func JSON(responseWriter http.ResponseWriter, statusCode int, data interface{}) {

	responseWriter.Header().Set("Content-Type", "application/json")

	responseWriter.WriteHeader(statusCode)

	if data != nil {
		if erro := json.NewEncoder(responseWriter).Encode(data); erro != nil {
			log.Fatal(erro)
		}
	}
}

func Error(responseWriter http.ResponseWriter, statusCode int, err error) {

	JSON(responseWriter, statusCode, struct {
		Error string `json:"error"`
	}{
		Error: err.Error(),
	})

}
