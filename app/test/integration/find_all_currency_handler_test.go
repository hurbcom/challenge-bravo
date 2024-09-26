package integration

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/currency_repository"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testdata"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testutils"
)

func TestFindAllCurrencyHandler(t *testing.T) {
	t.Run("it should find all currencies", testutils.RunTest(func(t *testing.T) {
		currencies, err := currency_repository.New().FindAll(context.TODO())
		if err != nil {
			t.Fatal(err)
		}

		oldLen := len(currencies)

		_, err = testdata.CreateCurrency()
		if err != nil {
			t.Fatal(err)
		}

		res := testutils.SendRequest(t, http.MethodGet, "currency", nil)

		body, err := io.ReadAll(res.Body)
		if err != nil {
			t.Fatal(err)
		}

		expectedResponse := []handler.FindAllCurrencyHandler{}

		if err := json.Unmarshal(body, &expectedResponse); err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, http.StatusOK, res.StatusCode)
		assert.Equal(t, oldLen+1, len(expectedResponse))
	}))
}
