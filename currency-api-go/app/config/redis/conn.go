// Cria e salva os registros no Redis como forma de
// cache para os valores convertidos.
package redis

import (
	"fmt"

	"github.com/garyburd/redigo/redis"

	"github.com/EltonARodrigues/currency-api-go/app/config"
)

const (
	redisExpire = 60
)

// Estabelece conexão com o Redis
func RedisConnect() redis.Conn {
	var address string
	config := *config.GetConf()

	for _, c := range config.Redis {
		address = fmt.Sprintf("%s:%s",
			c.Address,
			c.Port)
	}
	connect, err := redis.Dial("tcp", address)
	handleError(err)
	return connect
}

// Cria e salva a menssagem por x segundos
func Set(key string, value []byte) error {

	conn := RedisConnect()
	defer conn.Close()

	_, err := conn.Do("SET", key, []byte(value))
	handleError(err)

	conn.Do("EXPIRE", key, redisExpire) //10 Minutes

	return err
}

// Retorna um registro caso já exista no redis
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
