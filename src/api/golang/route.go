package main

import (
    "github.com/gorilla/mux"
)

func NewRouter() *mux.Router {

    router := mux.NewRouter().StrictSlash(true)
    router.HandleFunc("/converter/", GetConvertion).Methods("GET")

    return router
}