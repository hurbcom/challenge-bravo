package main

import (
	"encoding/json"
	"log"
	"github.com/mediocregopher/radix.v2/pool"
	"net/http"
	"strings"
	"strconv"
)

// Declare a global db variable to store the Redis connection pool.
var db *pool.Pool
const ballast_cur string = "USD"

func init() {
    var err error
    // Establish a pool of 10 connections to the Redis server listening on
    // port 6379 of the redis machine.
    db, err = pool.New("tcp", "redis:6379", 20)
    if err != nil {
        log.Panic("Error to connect a redis server: %s", err)
    }
}

// Display all from the converter var
func GetConvertion(w http.ResponseWriter, r *http.Request) {
	var converter []Converter

	from := strings.ToUpper(r.URL.Query()["from"][0])
	to := strings.ToUpper(r.URL.Query()["to"][0])
	amount, err := strconv.ParseFloat(r.URL.Query()["amount"][0], 64)
	if err != nil {
		log.Panic("Error in convertion type from %s. Error: %s", from, err)
		w.WriteHeader(http.StatusInternalServerError)

		return
	}
	rate := GetRate(from, to)
	if rate == 0 {
		log.Panic("Error in convertion type")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	converted := amount*rate
	_ = converted

	converter = append(converter, Converter{ From: from, To: to, Rate: rate, Amount: amount, ConvertedAmount: converted })
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(converter)
	
	return
}

func GetRate(from, to string) float64{
	conn, err := db.Get()
    if err != nil {
		log.Panic("Error get redis connection")
		return 0
	}
	key_arr := []string{from, to}
	key := strings.Join(key_arr, "")
	// Get on redis atual cotation based on fromto
	rate, err := conn.Cmd("GET", key).Float64()

	// Importantly, use defer and the connection pool's Put() method to ensure
    // that the connection is always put back in the pool before GetConverter()
    // exits.
	defer db.Put(conn)

	if err != nil {
		return GetRateReverse(from, to)
	}
	return rate

}

func GetRateReverse(from, to string) float64{
	conn, err := db.Get()
    if err != nil {
		log.Panic("Error get redis connection")
		return 0
	}
	key_arr := []string{to, from}
	key := strings.Join(key_arr, "")
	// Get on redis atual cotation based on fromto
	rate, err := conn.Cmd("GET", key).Float64()

	// Importantly, use defer and the connection pool's Put() method to ensure
    // that the connection is always put back in the pool before GetConverter()
    // exits.
	defer db.Put(conn)

	if err != nil {
		return GetRateByBallast(from, to)
	}
	return 1/rate
}

func GetRateByBallast(from, to string) float64{
	conn, err := db.Get()
    if err != nil {
		log.Panic("Error get redis connection")
		return 0
	}
	key_arr := []string{ballast_cur, from}
	key_from := strings.Join(key_arr, "")
	// Get on redis atual cotation based on fromto
	rate_from, err := conn.Cmd("GET", key_from).Float64()

	key_arr = []string{ballast_cur, to}
	key_to := strings.Join(key_arr, "")
	// Get on redis atual cotation based on fromto
	rate_to, err := conn.Cmd("GET", key_to).Float64()

	// Importantly, use defer and the connection pool's Put() method to ensure
    // that the connection is always put back in the pool before GetConverter()
    // exits.
	defer db.Put(conn)
	if err != nil {
		return 0
	} 
	key_arr = []string{from, to}
	key := strings.Join(key_arr, "")
	conn.Cmd("SET", key, rate_from/rate_to)
	return rate_from/rate_to
}