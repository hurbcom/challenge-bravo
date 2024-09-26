package integration

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testutils"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/cache_keys"
	aredis "github.com/wesleyfebarretos/challenge-bravo/pkg/redis"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/utils"
)

func TestCurrencyConversionHandler(t *testing.T) {
	t.Run("it should convert the value of one currency to another", testutils.RunTest(func(t *testing.T) {

		currenciesRateMap := map[string]float64{}
		from := "TST1"
		to := "TST2"

		currenciesRateMap[from] = 1
		currenciesRateMap[to] = 0.18
		amount := 10.0

		aredis.Set(context.TODO(), cache_keys.CURRENCIES_RATE_MAP, currenciesRateMap, 0)

		res := testutils.SendRequest(t, http.MethodGet, fmt.Sprintf("currency/convert?from=%s&to=%s&amount=%f", from, to, amount), nil)

		body, err := io.ReadAll(res.Body)
		if err != nil {
			t.Fatal(err)
		}

		expectedResponse := handler.CurrencyConversionResponse{}

		if err := json.Unmarshal(body, &expectedResponse); err != nil {
			t.Fatal(err)
		}

		fromValue := currenciesRateMap[from]
		toValue := currenciesRateMap[to]

		result := utils.RoundFloat((fromValue/toValue)*amount, 2)
		label := fmt.Sprintf("%.2f %s", result, to)

		assert.Equal(t, http.StatusOK, res.StatusCode)
		assert.Equal(t, result, expectedResponse.Value)
		assert.Equal(t, label, expectedResponse.Label)
	}))
}
