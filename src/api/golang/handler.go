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

func init() {
    var err error
    // Establish a pool of 10 connections to the Redis server listening on
    // port 6379 of the redis machine.
    db, err = pool.New("tcp", "redis:6379", 20)
    if err != nil {
        log.Panic(err)
    }
}

// Display all from the converter var
func GetConverter(w http.ResponseWriter, r *http.Request) {
	var converter []Converter

	from := strings.ToUpper(r.URL.Query()["from"][0])
	to := strings.ToUpper(r.URL.Query()["to"][0])
	amount, err := strconv.ParseFloat(r.URL.Query()["amount"][0], 64)
	if err != nil {
		log.Println("Error in convertion type")
	}

	key_arr := []string{from, to}
	key := strings.Join(key_arr, "")

	conn, err := db.Get()
    if err != nil {
        log.Panic("Error get redis connection")
	}
	// Importantly, use defer and the connection pool's Put() method to ensure
    // that the connection is always put back in the pool before FindAlbum()
    // exits.
    defer db.Put(conn)

	rate, err := conn.Cmd("GET", key).Float64()
	if err != nil {
		log.Println("Fail to get Key from redis")
	}
	converter = append(converter, Converter{From: from, To: to, Rate: rate, Amount: amount, ConvertedAmount: amount*rate})
	w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(converter)
}