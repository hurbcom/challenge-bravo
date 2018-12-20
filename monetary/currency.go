package monetary

import (
	"github.com/pkg/errors"
	"schonmann/challenge-bravo/keys"
	"schonmann/challenge-bravo/redis"
	"strconv"
)

/**
  Currency related logic.
*/

/**
  Convert any amount from one currency to another, based on it's quotas
  stored in database. These will be updated as of the update interval in
  the worker node.
*/

func ConvertCurrency(amount float64, from, to string) (float64, error) {
	currencies, err := redis.MGet(keys.QuotaKey(from), keys.QuotaKey(to))
	if err != nil {
		return 0, errors.New("Error retrieving quota info.")
	}

	fromQuotaRaw, toQuotaRaw := currencies[0], currencies[1]
	if fromQuotaRaw == nil {
		return 0, errors.New("'From' quota not found in database.")
	}

	if toQuotaRaw == nil {
		return 0, errors.New("'To' quota not found in database.")
	}

	fromQuota, err := strconv.ParseFloat(fromQuotaRaw.(string), 64)
	if err != nil {
		return 0, errors.New("Error parsing 'From' quota value from database.")
	}

	toQuota, err := strconv.ParseFloat(toQuotaRaw.(string), 64)
	if err != nil {
		return 0, errors.New("Error parsing 'To' quota value from database.")
	}

	ratio := toQuota / fromQuota
	return ratio * amount, nil
}
