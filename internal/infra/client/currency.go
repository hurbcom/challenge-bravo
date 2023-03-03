package client

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
)

type CurrencyClient struct {
	baseURL string
}

func NewCurrencyClient(baseURL string) *CurrencyClient {
	return &CurrencyClient{
		baseURL: baseURL,
	}
}

func (client *CurrencyClient) GetCurrency(name string) (*entity.Currency, error) {
	url := fmt.Sprintf("%s/%s/USD", client.baseURL, name)
	res, err := http.Get(url)
	if err != nil {
		return nil, &errors.ClientFailed{
			Message: fmt.Sprintf("Failed to get updated currency value for %s", name),
		}
	}

	buffer, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, &errors.UnprocessableError{
			Message: "Failed to convert response data from currency API",
		}
	}

	res.Body.Close()

	var currency float64
	err = json.Unmarshal(buffer, &currency)
	if err != nil {
		return nil, &errors.UnprocessableError{
			Message: "Failed to marshal curency API data",
		}
	}

	return &entity.Currency{
		Name: name,
		Rate: currency,
	}, nil
}
