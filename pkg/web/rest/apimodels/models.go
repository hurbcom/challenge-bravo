package apimodels

import (
	"encoding/json"
	"net/http"

	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apierror"
	"go.uber.org/zap"
)

// APIResponse is the struct used to send API responses by the SendJSON function.
type APIResponse[T Response] struct {
	Response    T           `json:"response,omitempty"`
	Error       *apierror.E `json:"error,omitempty"`
	Information Information `json:"information"`
}

// Response is a constraint of valid responses for this API.
type Response interface {
	Convertion | ~string | None | json.RawMessage
}

// None represents a null response.
// Usually used in case of an error.
type None struct {
	None string `json:"-"`
} // @name null

// SendJSON writes a JSON marshaled APIResponse to the http response writer.
// It sets the response status code to httpCode, and sets the Content-Type to application/json.
//
// SendJSON will overwrite all values inside response.Information.
func SendJSON[T Response](w http.ResponseWriter, httpCode int, response APIResponse[T]) {
	w.Header().Add("Content-Type", "application/json")
	response.Information.APIVersion = Version
	byts, err := json.Marshal(response)
	if err != nil {
		zap.L().Error("failed to marshal json on SendJSON", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(httpCode)
	_, _ = w.Write(byts)
}
