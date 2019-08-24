package resthandler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/tmcb/challenge-bravo/currency"
)

func conversionHandle(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	err := r.ParseForm()
	if err != nil {
		http.Error(w, "error parsing form", http.StatusUnprocessableEntity)
		return
	}
	from, ok := currency.ToCurrency(r.Form.Get("from"))
	if !ok {
		http.Error(w, "unprocessable field 'from'", http.StatusUnprocessableEntity)
		return
	}
	to, ok := currency.ToCurrency(r.Form.Get("to"))
	if !ok {
		http.Error(w, "unprocessable field 'to'", http.StatusUnprocessableEntity)
		return
	}
	amount, err := strconv.ParseFloat(r.Form.Get("amount"), 64)
	if err != nil {
		http.Error(w, "unprocessable field 'amount'", http.StatusUnprocessableEntity)
		return
	}
	convertedAmount, ok := currency.Convert(from, to, amount)
	if !ok {
		http.Error(w, "", http.StatusInternalServerError)
	}
	s := struct {
		From            string  `json:"from"`
		To              string  `json:"to"`
		Amount          float64 `json:"amount"`
		ConvertedAmount float64 `json:"converted_amount"`
	}{
		From:            from.ToString(),
		To:              to.ToString(),
		Amount:          amount,
		ConvertedAmount: convertedAmount,
	}
	err = json.NewEncoder(w).Encode(s)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
