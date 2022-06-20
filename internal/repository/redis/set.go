package redis

import (
	"fmt"
	"time"
)

// SetPrice currently price of currency on Redis
func (e *Engine) SetPrice(key string, value string) error {
	var err = e.client.Set(key, value, time.Hour*8).Err()
	if err != nil {
		return fmt.Errorf("error set price on redis: %w", err)
	}
	return nil
}
