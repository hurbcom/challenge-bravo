package handle

import (
	"net/http"

	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apierror"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apimodels"
)

// NotFound is a handler to return a proper not found JSON response.
func NotFound(w http.ResponseWriter, r *http.Request) {
	apimodels.SendJSON(w, http.StatusNotFound, apimodels.APIResponse[apimodels.None]{
		Error: apierror.ErrNotFound.Ptr(),
	})
}
