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
const ballastCur string = "USD"

func init() {
    var err error
    // Establish a pool of 10 connections to the Redis server listening on
    // port 6379 of the redis machine.
    db, err = pool.New("tcp", "redis:6379", 20)
    if err != nil {
        log.Panic("Error to connect a redis server")
    }
}

// Display all from the converter var
func GetConvertion(w http.ResponseWriter, r *http.Request) {

	from := strings.ToUpper(r.URL.Query()["from"][0])
	to := strings.ToUpper(r.URL.Query()["to"][0])
	amount, err := strconv.ParseFloat(r.URL.Query()["amount"][0], 64)
	if err != nil {
		log.Panic("Error in convertion type.")
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

	converter := Converter{ From: from, To: to, Rate: rate, Amount: amount, ConvertedAmount: converted }
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
	keyArr := []string{from, to}
	key := strings.Join(keyArr, "")
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
	keyArr := []string{to, from}
	key := strings.Join(keyArr, "")
	// Get on redis atual cotation based on tofrom
	rate, err := conn.Cmd("GET", key).Float64()

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
	keyArrFrom := []string{ballastCur, from}
	keyFrom := strings.Join(keyArrFrom, "")
	// Get on redis atual cotation based on USDfrom
	rateFrom, err := conn.Cmd("GET", keyFrom).Float64()

	keyArrTo := []string{ballastCur, to}
	keyTo := strings.Join(keyArrTo, "")
	// Get on redis atual cotation based on USDto
	rateTo, err := conn.Cmd("GET", keyTo).Float64()

	defer db.Put(conn)

	if err != nil {
		return 0
	} 

	keyArr := []string{from, to}
	key := strings.Join(keyArr, "")
	ballastRate := (rateTo / rateFrom)
	conn.Cmd("SET", key, ballastRate)
	return ballastRate
}