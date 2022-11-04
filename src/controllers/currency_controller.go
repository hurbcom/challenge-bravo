package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/felipepnascimento/api-go-gin/models"
)

func Convert(w http.ResponseWriter, r *http.Request) {
	var from = r.URL.Query().Get("from")
	var to = r.URL.Query().Get("to")
	a, _ := strconv.ParseFloat(r.URL.Query().Get("amount"), 32)
	var amount = float32(a)

	var conversion = models.Conversion{
		From:   from,
		To:     to,
		Amount: amount,
		Result: amount * 2,
	}

	// db.First(&user, "id = ?", "1b74413f-f3b8-409f-ac47-e8c062e3472a")

	json.NewEncoder(w).Encode(conversion)
}
