package redis

import (
	"fmt"

	//. "github.com/challenge-bravo/currency-api-go/app/config"


	"github.com/garyburd/redigo/redis"
)

const (
	redisExpire = 60
)

func RedisConnect() redis.Conn {
	connect, err := redis.Dial("tcp", "0.0.0.0:6379")
	handleError(err)
	return connect
}

func Set(key string, value []byte) error {

	conn := RedisConnect()
	defer conn.Close()

	_, err := conn.Do("SET", key, []byte(value))
	handleError(err)

	conn.Do("EXPIRE", key, redisExpire) //10 Minutes

	return err
}

func Get(key string) ([]byte, error) {

	conn := RedisConnect()
	defer conn.Close()

	var data []byte
	data, err := redis.Bytes(conn.Do("GET", key))
	if err != nil {
		return data, fmt.Errorf("error getting key %s: %v", key, err)
	}
	return data, err
}

func handleError(err error) {
	if err != nil {
	   panic(err)
	}
  }