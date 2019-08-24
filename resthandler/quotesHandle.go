package resthandler

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/tmcb/challenge-bravo/currency"
)

func quotesHandle(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	c, ok := currency.ToCurrency(p.ByName("currency"))
	if !ok {
		http.Error(w, "", http.StatusNotFound)
		return
	}
	q, ok := currency.Quote(c)
	if !ok {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	s := struct {
		Currency string  `json:"currency"`
		Quote    float64 `json:"quote"`
	}{
		Currency: c.ToString(),
		Quote:    q,
	}
	err := json.NewEncoder(w).Encode(s)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
