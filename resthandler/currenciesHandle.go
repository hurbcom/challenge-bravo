package resthandler

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/tmcb/challenge-bravo/currency"
)

func currenciesHandle(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	s := struct {
		Currencies []string `json:"currencies"`
	}{}
	for _, c := range currency.Currencies() {
		s.Currencies = append(s.Currencies, c.ToString())
	}
	err := json.NewEncoder(w).Encode(s)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
