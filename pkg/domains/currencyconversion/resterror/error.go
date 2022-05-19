package resterror

import (
	"net/http"

	"github.com/pkg/errors"
)

const (
	defaultResponse string = "Sorry, something went wrong"
	defaultCode     int    = http.StatusInternalServerError
)

var (
	// ErrNew represents an error when creating a new CurrencyConversion
	ErrNew = errors.New("unable to create new currencyConversion")
	// ErrEmptyRepository repository cannot be nil
	ErrEmptyRepository = errors.New("empty repository")
	// ErrTypeAssertion arises while trying to perform interface{}.(T)
	ErrTypeAssertion = errors.New("unable to execute type assertion")
)

type errorResponse struct {
	response string
	code     int
}

type restError map[error]errorResponse

// RESTErrorBussines Errors you want to map to more meaning response for clients and set specific
// HTTP status code should be included here
var RESTErrorBussines = restError{
	ErrNew: {"Sorry, we cannot create a new currencyConversion", http.StatusInternalServerError},
}

func (re restError) ErrorProcess(err error) (string, int) {
	for rErr, resp := range re {
		if errors.Is(err, rErr) {
			return resp.response, resp.code
		}
	}

	return err.Error(), defaultCode
}
