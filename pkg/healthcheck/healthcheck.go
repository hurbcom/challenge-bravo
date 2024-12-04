package healthcheck

import "github.com/danielmalka/challenge-bravo/pkg/storage"

func HealthCheck(userPass, schema, host string) error {
	db, err := storage.ConnectMysql(userPass, schema, host)
	if err != nil {
		return err
	}
	storage.Close(db, true)
	return nil
}
