package app

import (
	"encoding/json"
	"errors"
	"net/http"
)

// CurrencyHandler holder struct
type CurrencyHandler struct {
	App *App
}

// CurrencyRequest is the expected request
type CurrencyRequest struct {
	Symbol string `json:"symbol"`
}

// NewCurrencyHandler creates a saving handler
func NewCurrencyHandler(a *App) *CurrencyHandler {
	return &CurrencyHandler{
		App: a,
	}
}

// ServeHTTP serves the post endpoint
func (s *CurrencyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var request CurrencyRequest

	if r.Body == nil {
		WriteError(w, http.StatusBadRequest, "request body shouldnt be empty", errors.New("Empty Body"))
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		WriteError(w, http.StatusBadRequest, "failed to decode request", err)
		return
	}

	err := s.App.Storage.AddToAllowedList(request.Symbol)

	if err != nil {
		WriteError(w, http.StatusInternalServerError, "Failed to add new currency to allowed list", err)
		return
	}

	s.App.Logger.Info("Saved new currency to allowed list...")
	WriteSuccessWithJSON(w, http.StatusOK, []byte("Saved new currency"), "saved")
}
