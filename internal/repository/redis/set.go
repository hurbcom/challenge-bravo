package redis

import "time"

func (e *Engine) Set(key string, value string) error {
	// todo set expiration date
	var err = e.client.Set(key, value, 3*time.Hour).Err()
	if err != nil {
		return err
	}
	return nil

}
