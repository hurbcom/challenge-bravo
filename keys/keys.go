package keys

import "fmt"

const (
	quotasPrefix = "quota"
)

func QuotaKey(currency string) string {
	return fmt.Sprintf("%s:%s", quotasPrefix, currency)
}
