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

func TestFindCurrencyByCodeHandler(t *testing.T) {
	t.Run("it should find a currency by code", testutils.RunTest(func(t *testing.T) {
		user, err := testdata.CreateUser()
		if err != nil {
			t.Fatal(err)
		}

		res := testutils.SendRequestWithToken(t, http.MethodGet, "currency/code/USD", user, nil)

		body, err := io.ReadAll(res.Body)
		if err != nil {
			t.Fatal(err)
		}

		expectedResponse := handler.FindCurrencyByCodeResponse{}

		if err := json.Unmarshal(body, &expectedResponse); err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, http.StatusOK, res.StatusCode)
		assert.Equal(t, "USD", expectedResponse.Code)
		assert.Equal(t, 1, expectedResponse.ID)
		assert.Equal(t, float64(1), expectedResponse.USDExchangeRate)
	}))
}
