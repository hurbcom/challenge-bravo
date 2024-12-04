package flags

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/danielmalka/challenge-bravo/config"
	"github.com/danielmalka/challenge-bravo/internal/sync"
	"github.com/danielmalka/challenge-bravo/pkg/healthcheck"
)

// CheckFlags - check for command line params
func CheckFlags(c config.Config) {
	// health check
	health := flag.Bool("health-check", false, "Returns status 0 on success")

	// Migrate storage
	syncCurrencies := flag.Bool("sync", false, "Sync Currencies Command")

	// parse all
	flag.Parse()

	if *health {
		log.Printf("Health checking... ")
		userPass := fmt.Sprintf("%s:%s", c.DBUser, c.DBPass)
		host := fmt.Sprintf("%s:%s", c.DBHost, c.DBPort)
		err := healthcheck.HealthCheck(userPass, c.DBSchema, host)
		if err != nil {
			log.Fatal("❌ Failed with error: ", err)
		}
		log.Printf("✔️ Passed")
		os.Exit(0)
	}

	if *syncCurrencies {
		log.Println("Syncing currencies...")
		userPass := fmt.Sprintf("%s:%s", c.DBUser, c.DBPass)
		host := fmt.Sprintf("%s:%s", c.DBHost, c.DBPort)
		sync.SyncCurrencies(userPass, host, c.DBSchema, c.ExchangeRateApiPath)
		os.Exit(0)
	}
}
