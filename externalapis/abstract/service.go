package abstract

import (
	"context"

	"github.com/Pedro-Pessoa/challenge-bravo/externalapis"
)

// GetCurrencyConvertions makes a request to the abstract API and return all the
// converted values for the passed currency.
func GetCurrencyConvertions(currencyCode, apiKey string) (LiveResponse, error) {
	result, _, _, err := externalapis.MakeRequest[LiveResponse](
		context.Background(),
		"GET",
		BaseURL+EndpointGetLive(currencyCode, nil, apiKey),
		nil,
		nil,
		nil,
	)

	if err != nil {
		return LiveResponse{}, err
	}

	return *result, nil
}
