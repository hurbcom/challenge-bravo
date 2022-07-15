package workers

import (
	"math"
	"strconv"

	"github.com/Pedro-Pessoa/challenge-bravo/externalapis/abstract"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/cache"
)

func getResult(v float64, maxUnits int) string {
	if maxUnits == 0 {
		// If the currency doesn't have decimals,
		// the float mus be truncated.
		v = math.Trunc(v)
	}

	return strconv.FormatFloat(v, 'f', maxUnits, 64)
}

func getAndCache(code, apiKey string, s *cache.Store[string, *abstract.LiveResponse]) (abstract.LiveResponse, error) {
	res, err := abstract.GetCurrencyConvertions(code, apiKey)
	if err != nil {
		return abstract.LiveResponse{}, err
	}

	s.Set(res.Base, &res)
	return res, nil
}
