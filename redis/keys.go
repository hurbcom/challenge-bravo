package redis

import "fmt"

const (
	quotaPrefix = "quota"
)

func CurrencyQuotaKey(currency string) string {
	return fmt.Sprintf("%s:%s", quotaPrefix, currency)
}
