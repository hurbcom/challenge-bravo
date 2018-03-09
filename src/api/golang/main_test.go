package main

import (
	"testing"
	"net/http"
	"encoding/json"
	"time"
	"math"
)

var myClient = &http.Client{Timeout: 10 * time.Second}

func getJson(url string, target interface{}) error {
    r, err := myClient.Get(url)
    if err != nil {
        return err
    }
    defer r.Body.Close()

    return json.NewDecoder(r.Body).Decode(target)
}

func TestRigthConvertion(t *testing.T) {
	t.Log("Test put rate on Redis and get a convertion... (expected converted_amount: 20)")
	conn, err := db.Get()
	if err != nil {
		t.Errorf("Error on Redis")
	}
	conn.Cmd("SET", "USDBRL", 4)
	defer db.Put(conn)
	conv := new(Converter)
	getJson("http://localhost:8000/converter/?from=USD&to=BRL&amount=5", conv)
	if converted_amount := conv.ConvertedAmount; converted_amount != 20 {
		t.Errorf("Expected converted_amount of 20, but it was %f instead.", converted_amount)
	}

}

func TestConvertionByBallast(t *testing.T) {
	t.Log("Test put rate on Redis and get a convertion by Ballast currency")
	conn, err := db.Get()
	if err != nil {
		t.Errorf("Error on Redis")
	}
	conn.Cmd("SET", "USDBRL", 3.2414)
	conn.Cmd("SET", "USDEUR", 0.80509)
	conn.Cmd("DEL", "BRLEUR")
	conn.Cmd("DEL", "EURBRL")
	defer db.Put(conn)
	conv := new(Converter)
	getJson("http://localhost:8000/converter/?from=BRL&to=EUR&amount=5", conv)
	ballastRate := math.Round((0.80509/3.2414)*5)
	if converted_amount := math.Round(conv.ConvertedAmount); converted_amount != ballastRate {
		t.Errorf("Expected converted_amount of %f, but it was %f instead.", ballastRate, converted_amount)
	}

}