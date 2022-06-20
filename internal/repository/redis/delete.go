package redis

import "fmt"

// Delete removes the currency from Redis
func (e *Engine) Delete(key string) error {
	var err = e.client.Del(key).Err()

	if err != nil {
		return fmt.Errorf("error deleting currency from redis: %s", err.Error())
	}

	return nil
}
