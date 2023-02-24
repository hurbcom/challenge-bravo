package controller

import (
	"encoding/json"
	"net/http"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
)

type NotFound struct{}

func NewNotFound() *NotFound {
	return &NotFound{}
}

func (*NotFound) NotFound(rw http.ResponseWriter, req *http.Request) {
	errorNotFound := model.Error{
		Code:    404,
		Message: "Not Found",
	}
	rw.WriteHeader(http.StatusNotFound)
	json.NewEncoder(rw).Encode(errorNotFound)
}
