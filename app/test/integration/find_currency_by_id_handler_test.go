package integration

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testdata"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testutils"
)

func TestFindCurrencyByIdHandler(t *testing.T) {
	t.Run("it should find a currency by id", testutils.RunTest(func(t *testing.T) {
		user, err := testdata.CreateUser()
		if err != nil {
			t.Fatal(err)
		}

		currency, err := testdata.CreateCurrency()
		if err != nil {
			t.Fatal(err)
		}

		res := testutils.SendRequestWithToken(t, http.MethodGet, fmt.Sprintf("currency/%d", currency.ID), user, nil)

		body, err := io.ReadAll(res.Body)
		if err != nil {
			t.Fatal(err)
		}

		expectedResponse := handler.FindCurrencyByIdResponse{}

		if err := json.Unmarshal(body, &expectedResponse); err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, http.StatusOK, res.StatusCode)
		assert.Equal(t, currency.Code, expectedResponse.Code)
		assert.Equal(t, currency.ID, expectedResponse.ID)
		assert.Equal(t, currency.Name, expectedResponse.Name)
	}))
}
