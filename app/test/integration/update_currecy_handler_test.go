package integration

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/currency_repository"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testdata"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testutils"
)

func TestUpdateCurrencyHandler(t *testing.T) {
	t.Run("it should update a currency", testutils.RunTest(func(t *testing.T) {
		user, err := testdata.CreateUser()
		if err != nil {
			t.Fatal(err)
		}

		currency, err := testdata.CreateCurrency()
		if err != nil {
			t.Fatal(err)
		}

		newCurrencyReq := handler.UpdateCurrencyRequest{
			CountryCode:     testutils.Pointer("TTT"),
			Number:          testutils.Pointer(200),
			SearchURL:       testutils.Pointer("http://test.com"),
			Fic:             testutils.Pointer(false),
			Country:         testutils.Pointer("TTT"),
			Name:            "TTT",
			Code:            "ttt",
			USDExchangeRate: 2,
		}

		res := testutils.SendRequestWithToken(t, http.MethodPut, fmt.Sprintf("currency/%d", currency.ID), user, newCurrencyReq)

		body, err := io.ReadAll(res.Body)
		if err != nil {
			t.Fatal(err)
		}

		expectedResponse := false

		if err := json.Unmarshal(body, &expectedResponse); err != nil {
			t.Fatal(err)
		}

		expectedCurrency, err := currency_repository.New().FindOneById(context.TODO(), currency.ID)

		assert.Equal(t, http.StatusOK, res.StatusCode)
		assert.True(t, expectedResponse)
		assert.Equal(t, newCurrencyReq.CountryCode, expectedCurrency.CountryCode)
		assert.Equal(t, newCurrencyReq.SearchURL, expectedCurrency.SearchURL)
		assert.Equal(t, *newCurrencyReq.Fic, *expectedCurrency.Fic)
		assert.Equal(t, newCurrencyReq.Country, expectedCurrency.Country)
		assert.Equal(t, newCurrencyReq.Name, expectedCurrency.Name)
		assert.Equal(t, strings.ToUpper(newCurrencyReq.Code), expectedCurrency.Code)
		assert.Equal(t, newCurrencyReq.USDExchangeRate, expectedCurrency.USDExchangeRate)
	}))
}
