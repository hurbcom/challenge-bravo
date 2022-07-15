// Package swaggomodels is used to build the documentation using swaggo.
// It is necessary because the system uses generics in it's structures,
// but generics are not yet supported by swaggo.
package swaggomodels

import (
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apierror"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apimodels"
)

// APIValidResponseMock mocks a valid API response
type APIValidResponseMock struct {
	Response    any                   `json:"response"`
	Information apimodels.Information `json:"information"`
}

// APIFailResponseMock mocks a failed API response
type APIFailResponseMock struct {
	Error       *apierror.E           `json:"error"`
	Information apimodels.Information `json:"information"`
}
