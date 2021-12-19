package connections

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

/* Open MySQL database connection */
func OpenMysqlDB(driver string, dsn string, timeout time.Duration) (*sql.DB, error) {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	timeoutExceeded := time.After(timeout)
	for {
		select {
		case <-timeoutExceeded:
			return nil, fmt.Errorf("db connection failed after %s timeout", timeout)

		case <-ticker.C:
			// Open up our database connection.
			db, err := sql.Open(driver, dsn)

			if err == nil {
				// Define some configurations
				db.SetMaxOpenConns(20)
				db.SetMaxIdleConns(20)
				db.SetConnMaxLifetime(5 * time.Minute)

				ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
				defer cancelfunc()
				// Check connection
				err = db.PingContext(ctx)
				if err != nil {
					log.Printf("Errors %s pinging DB", err)
				}

				return db, nil
			} else {
				log.Printf("failed to connect to db %s", dsn)
			}
		}
	}
}
