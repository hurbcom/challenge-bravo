package redis

import "github.com/go-redis/redis"

func (e *Engine) Get(key string) (interface{}, error) {
	var result, err = e.client.Get(key).Result()
	if err == redis.Nil {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return result, nil
}
