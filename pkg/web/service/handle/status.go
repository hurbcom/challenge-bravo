package handle

import (
	"net/http"

	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apimodels"
)

// Status shows the status of the API
// @Summary      	Status
// @Description  	Will return with the API status
// @Produce      	json
// @Success      	200  {object}  swaggomodels.APIValidResponseMock{response=string}
// @Router       	/api/v0/status [get]
func Status(w http.ResponseWriter, r *http.Request) {
	apimodels.SendJSON(w, http.StatusOK, apimodels.APIResponse[string]{
		Response: "online",
	})
}
