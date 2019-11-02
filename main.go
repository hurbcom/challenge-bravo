package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func homeReturn(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Test, test. \nokay")
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", homeReturn)
	log.Fatal(http.ListenAndServe(":8080", router))
}
