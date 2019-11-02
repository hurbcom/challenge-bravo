package service

import (
	"fmt"
	"net/http"
)

func Healthcheck(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Ok")

	w.WriteHeader(http.StatusOK)

	fmt.Fprintf(w, "Ok")
}
