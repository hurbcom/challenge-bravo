package db

import (
	"fmt"
	"time"

	"github.com/gomodule/redigo/redis"
)

//Redis holds the config from RedisDB
type Redis struct {
	Address string
	Port    string
	Pass    string
	Pool    *redis.Pool
}

//Connect sets a connection pool
func (r *Redis) Connect() {
	poolHandler := &redis.Pool{
		MaxIdle:   80,
		MaxActive: 1000,
		Dial: func() (redis.Conn, error) {
			c, err := redis.DialURL(fmt.Sprintf("%s:%s", r.Address, r.Port))
			if err != nil {
				panic(err.Error())
			}
			return c, err
		},
		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
	r.Pool = poolHandler
}

//HMGet gets the values that matches the query in Redis
func (r *Redis) HMGet(args []interface{}) ([]float64, error) {
	conn := r.Pool.Get()
	defer conn.Close()
	values, err := redis.Float64s(conn.Do("HMGET", args...))
	if err != nil {
		return nil, err
	}
	return values, nil
}

//HMSet sets key-value pairs in Redis
func (r *Redis) HMSet(args []interface{}) error {
	conn := r.Pool.Get()
	defer conn.Close()

	_, err := conn.Do("HMSET", args...)
	return err
}
