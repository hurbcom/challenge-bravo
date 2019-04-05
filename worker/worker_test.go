package worker

import (
	"encoding/json"
	"errors"
	"testing"

	"gotest.tools/assert"
	is "gotest.tools/assert/cmp"

	"github.com/hurbcom/challenge-bravo/controller"
	coinmarket "github.com/hurbcom/challenge-bravo/plugin/coinmarketcap"
	"github.com/hurbcom/challenge-bravo/plugin/fixer"
	"github.com/hurbcom/challenge-bravo/util"
)

func TestGetData(t *testing.T) {
	response, _ := json.Marshal(map[string]interface{}{
		"rates": map[string]float64{
			"BRL": 0.75,
			"USD": 6.23,
			"EUR": 1,
		},
	})
	responseCrypto, _ := json.Marshal(map[string]interface{}{
		"data": map[string]interface{}{
			"BTC": map[string]interface{}{
				"name": "BTC",
				"quote": map[string]interface{}{
					"EUR": map[string]float64{
						"price": 183.23,
					},
				},
			},
		},
	})

	fc := controller.CurrencyController{
		API: fixer.Fixer{
			Caller: &util.FakeCurrencyAPICaller{
				Err:      nil,
				Response: response,
			},
		},
		CryptoAPI: coinmarket.CoinMarketCap{
			Caller: &util.FakeCryptoCurrencyAPICaller{
				Err:      nil,
				Response: responseCrypto,
			},
		},
	}

	expected := map[string]float64{
		"BRL": 0.75,
		"USD": 6.23,
		"EUR": 1,
		"BTC": 183.23,
	}

	result := getData(fc)
	assert.DeepEqual(t, expected, result, nil)

	fc.API = fixer.Fixer{
		Caller: &util.FakeCurrencyAPICaller{
			Err: errors.New("some error"),
		},
	}

	expected = map[string]float64{
		"BTC": 183.23,
	}
	result = getData(fc)
	assert.DeepEqual(t, expected, result, nil)

	fc.CryptoAPI = coinmarket.CoinMarketCap{
		Caller: &util.FakeCryptoCurrencyAPICaller{
			Err: errors.New("some error"),
		},
	}

	result = getData(fc)
	assert.Assert(t, is.Nil(result))

}
