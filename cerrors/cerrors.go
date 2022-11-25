package cerrors

import (
	"encoding/json"
	"log"
	"net/http"
)

const (
	ErrInvalidCode  = "code field must be string "
	ErrInvalidName  = "name field must be string "
	ErrInvalidToUsd = "tousd field must be float with 2 decimals "
	ErrInvalidType  = "type field must be be string "

	ErrEmptycode  = "code field must be not null "
	ErrEmptyName  = "name field must be not null "
	ErrEmptyToUsd = "tousd field must be not null "
	ErrEmptyType  = "type field must be not null "

	ErrParseBody        = "error when reading request body "
	ErrUnmarshalBody    = "error when unmarshal request body "
	ErrUpdateCurrencyDB = "error when update currency on database "
	ErrSearchCurrencyDB = "error when search currency on database "
	ErrSaveCurrencyDB   = "error when save currency on database "
	ErrDeleteCurrencyDB = "error when delete currency on database "
	ErrSendResponseBody = "error when send response body "

	ErrResourceNotFound = "resource not found "
)

type Cerror struct {
	Message     string `json:"message"`
	StatusCode  int    `json:"status-code"`
	Attribute   string `json:"attribute"`
	Description string `json:"description"`
	Details     string `json:"details"`
}

func (cerror *Cerror) LogAndPostNewHurbError(w http.ResponseWriter, r *http.Request) error {

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(cerror.StatusCode)
	if err := json.NewEncoder(w).Encode(cerror); err != nil {
		return err
	}
	log.Printf("\nError:{\n\tMessage: %s\n\tStatusCode: %d\n\tAttribute: %s\n\tDescription: %s\n\tDetails: %s\n}",
		cerror.Message, cerror.StatusCode, cerror.Attribute, cerror.Description, cerror.Details)
	return nil
}
