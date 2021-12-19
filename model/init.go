package model

import (
	"context"
	"github.com/go-redis/cache/v8"
	"github.com/go-redis/redis/v8"
	"github.com/jackc/pgx/v4/pgxpool"
	"log"
)

var db *pgxpool.Pool
var _cache *cache.Cache
var redisClient *redis.Client

// Init Initializes data layer, where dbDSN is the postgres connection string and
// cacheDSN is the redis connection string
func Init(dbDSN, cacheDSN string) error {

	var err error
	if db, err = initDB(dbDSN); err != nil {
		return err
	}

	if _cache, redisClient, err = initCache(cacheDSN); err != nil {
		terminateDB(db)
		return err
	}

	return nil
}

// Terminate data layer
func Terminate() {
	terminateDB(db)
	terminateCache(redisClient)
}

// initDB Initialize database connection pool
func initDB(dbDSN string) (*pgxpool.Pool, error) {

	// Parse connection string
	poolConfig, err := pgxpool.ParseConfig(dbDSN)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	// Create database connection pool
	dbPoll, err := pgxpool.ConnectConfig(context.Background(), poolConfig)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return dbPoll, nil
}

// terminateDB Close database connections
func terminateDB(dbPoll *pgxpool.Pool) {
	dbPoll.Close()
}

// initCache Initialize cache connection
func initCache(cacheDSN string) (*cache.Cache, *redis.Client, error) {

	// Parse connection string
	opt, err := redis.ParseURL(cacheDSN)
	if err != nil {
		log.Println(err)
		return nil, nil, err
	}

	// Establish a connection to the cache server and verify the connection.
	client := redis.NewClient(opt)
	if _, err = client.Ping(context.Background()).Result(); err != nil {
		log.Println(err)
		return nil, nil, err
	}

	// Create wrapper and return
	return cache.New(&cache.Options{Redis: client}), client, nil
}

// terminateCache Close cache connections
func terminateCache(client *redis.Client) {
	if err := client.Close(); err != nil {
		log.Println(err)
	}
}
