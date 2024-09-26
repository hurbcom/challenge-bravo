package integration

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/currency_repository"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testdata"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testutils"
)

func TestDeleteCurrencyHandler(t *testing.T) {
	t.Run("it should delete a currency", testutils.RunTest(func(t *testing.T) {
		user, err := testdata.CreateUser()
		if err != nil {
			t.Fatal(err)
		}

		currency, err := testdata.CreateCurrency()
		if err != nil {
			t.Fatal(err)
		}

		res := testutils.SendRequestWithToken(t, http.MethodDelete, fmt.Sprintf("currency/%d", currency.ID), user, nil)

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
		assert.NotNil(t, err)
		assert.Nil(t, expectedCurrency)
	}))
}
