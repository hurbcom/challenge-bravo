package integration

import (
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testdata"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testutils"
)

func TestCreateCurrencyHandler(t *testing.T) {
	t.Run("it should create a currency", testutils.RunTest(func(t *testing.T) {
		user, err := testdata.CreateUser()
		if err != nil {
			t.Fatal(err)
		}

		newCurrencyReq := handler.CreateCurrencyRequest{
			CountryCode:        testutils.Pointer("USA"),
			Number:             testutils.Pointer(200),
			SearchURL:          testutils.Pointer("http://test.com"),
			ResponsePathToRate: testutils.Pointer("obj;rate"),
			Fic:                testutils.Pointer(true),
			Country:            testutils.Pointer("test"),
			Name:               "test",
			Code:               "TST",
			USDExchangeRate:    1,
		}

		res := testutils.SendRequestWithToken(t, http.MethodPost, "currency", user, newCurrencyReq)

		body, err := io.ReadAll(res.Body)
		if err != nil {
			t.Fatal(err)
		}

		expectedCurrency := handler.CreateCurrencyResponse{}

		if err := json.Unmarshal(body, &expectedCurrency); err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, http.StatusCreated, res.StatusCode)
		assert.NotEmpty(t, expectedCurrency.ID)
		assert.Equal(t, newCurrencyReq.Code, expectedCurrency.Code)
		assert.Equal(t, newCurrencyReq.CountryCode, expectedCurrency.CountryCode)
		assert.Equal(t, newCurrencyReq.Number, expectedCurrency.Number)
		assert.Equal(t, newCurrencyReq.SearchURL, expectedCurrency.SearchURL)
		assert.Equal(t, newCurrencyReq.ResponsePathToRate, expectedCurrency.ResponsePathToRate)
		assert.Equal(t, *newCurrencyReq.Fic, *expectedCurrency.Fic)
		assert.Equal(t, newCurrencyReq.Country, expectedCurrency.Country)
		assert.Equal(t, newCurrencyReq.Code, expectedCurrency.Code)
		assert.Equal(t, newCurrencyReq.Name, expectedCurrency.Name)
		assert.Equal(t, newCurrencyReq.USDExchangeRate, expectedCurrency.USDExchangeRate)
	}))
}
