package db

import (
	"challenge-bravo/server/services"
	"challenge-bravo/utils"
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var Connection *sql.DB

// Init starts connection to database
func Init() {
	if Connection == nil {
		conn, err := sql.Open("sqlite3", "./exchange.db")
		if err != nil {
			log.Println(err.Error())
			return
		}

		stmt, err := conn.Prepare("CREATE TABLE IF NOT EXISTS moedas (id INTEGER PRIMARY KEY, nome VARCHAR UNIQUE, codigo VARCHAR UNIQUE, valor REAL)")
		if err != nil {
			log.Println(err.Error())
			return
		}
		stmt.Exec()

		Connection = conn
		insertDefaultCurrencies()
	}
}

func insertDefaultCurrencies() {
	currencies := map[string]string{
		"Dólar":    "USD",
		"Real":     "BRL",
		"Euro":     "EUR",
		"Bitcoin":  "BTC",
		"Ethereum": "ETH",
	}

	for name, code := range currencies {
		value, err := services.ExchangeAPI(code)
		if err != nil {
			log.Fatal(err.Error())
		}
		_, err = Connection.Exec(utils.BuildString("INSERT OR IGNORE INTO moedas (nome, codigo, valor) VALUES ('", name, "', '", code, "', ", value, ")"))
		if err != nil {
			log.Fatal(err.Error())
		}
	}
}
