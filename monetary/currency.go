package monetary

import (
	"github.com/pkg/errors"
	"github.com/schonmann/challenge-bravo/keys"
	"github.com/schonmann/challenge-bravo/redis"
	"strconv"
)

/**
  Convert any amount from one currency to another, based on it's quotas
  stored in database. These will be updated as of the update interval in
  the worker node.
*/

func ConvertCurrency(amount float64, from, to string) (float64, error) {
	rawQuotas, err := redis.MGet(keys.QuotaKey(from), keys.QuotaKey(to))
	if err != nil {
		return 0, errors.New("Error retrieving quota info in database.")
	}
	fromQuota, err := parseRawQuota(rawQuotas[0])
	if err != nil {
		return 0, errors.New("error parsing 'from' quota: " + err.Error())
	}
	toQuota, err := parseRawQuota(rawQuotas[1])
	if err != nil {
		return 0, errors.New("error parsing 'to' quota: " + err.Error())
	}
	return calculateConversion(amount, fromQuota, toQuota)
}

/**
  Parses float64 quota from string.
*/

func parseRawQuota(quotaRaw interface{}) (float64, error) {
	if quotaRaw == nil {
		return 0, errors.New("quota is nil")
	}
	quotaStr, ok := quotaRaw.(string)
	if !ok {
		return 0, errors.New("quota parsing error (not a string)")
	}
	quota, err := strconv.ParseFloat(quotaStr, 64)
	if err != nil {
		return 0, errors.New("quota parsing error")
	}
	return quota, nil
}

/**
  Do the conversion keeping floating point precision untouched.
*/

func calculateConversion(amount, fromQuota, toQuota float64) (float64, error) {
	if fromQuota == 0 {
		return 0, errors.New("'from' quota equals zero")
	}
	ratio := toQuota / fromQuota
	return ratio * amount, nil
}
