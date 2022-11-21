package controllers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"github.com/Ricardo-Sales/challenge-bravo/models"
	"github.com/gorilla/mux"
)

func GetAllCurrency(w http.ResponseWriter, r *http.Request) {
	var crs []models.Currency
	var err error

	crs, err = models.GetAll()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(crs); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
}

func GetOneCurrency(w http.ResponseWriter, r *http.Request) {
	var cr models.Currency
	var err error

	params := mux.Vars(r)
	id, err := strconv.ParseUint(params["id"], 10, 32)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	cr.ID = uint32(id)

	err = cr.GetOne()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(cr); err != nil {
		w.Write([]byte(err.Error()))
		return
	}
}

func PostCurrency(w http.ResponseWriter, r *http.Request) {

	var cr models.Currency

	body, err := io.ReadAll(r.Body)
	if err != nil {
		w.Write([]byte("error when read request body"))
		return
	}
	if err = json.Unmarshal(body, &cr); err != nil {
		w.Write([]byte("error when parse body request"))
		return
	}

	if err = cr.Save(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(cr); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
}
func PutCurrency(w http.ResponseWriter, r *http.Request) {

}
func DeleteCurrency(w http.ResponseWriter, r *http.Request) {

}
