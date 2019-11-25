package app

import (
	"net/http"

	"github.com/gorilla/mux"
)

// DeleteHandler struct
type DeleteHandler struct {
	App *App
}

// NewDeleteHandler creates a new handler
func NewDeleteHandler(a *App) *DeleteHandler {
	return &DeleteHandler{
		App: a,
	}
}

// ServeHTTP method
func (s *DeleteHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["symbol"]

	err := s.App.Storage.RemoveFromAllowedList(id)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	s.App.Logger.Info("Deleted currency from allowed list...")
	WriteSuccessWithJSON(w, http.StatusOK, []byte("Deleted"), "deleted")
}
