package db

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/config"
)

type DBConn interface {
	Exec(context.Context, string, ...any) (pgconn.CommandTag, error)
	Query(context.Context, string, ...any) (pgx.Rows, error)
	QueryRow(context.Context, string, ...any) pgx.Row
	Begin(context.Context) (pgx.Tx, error)
}

var (
	conn     DBConn
	initOnce sync.Once
	testTx   pgx.Tx
)

func openConnection(connector string) error {
	_config, err := pgxpool.ParseConfig(connector)
	if err != nil {
		return err
	}

	_config.MaxConns = int32(config.Envs.DB.PoolMaxConn)

	insideConn, err := pgxpool.NewWithConfig(context.Background(), _config)
	if err != nil {
		return err
	}
	conn = insideConn

	return nil
}

func getStringConnection() string {
	return fmt.Sprintf("host=%s port=%s user=%s "+"password=%s dbname=%s sslmode=disable",
		config.Envs.DB.Host,
		config.Envs.DB.Port,
		config.Envs.DB.User,
		config.Envs.DB.Password,
		config.Envs.DB.Name)
}

func healthCheck() error {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	// Simple query to check database connectivity
	row := conn.QueryRow(ctx, "SELECT 1")
	var result int
	if err := row.Scan(&result); err != nil {
		return fmt.Errorf("database health check failed: %w", err)
	}
	return nil
}

func Init() (*pgxpool.Pool, error) {
	var err error
	initOnce.Do(func() {
		conn := getStringConnection()
		_err := openConnection(conn)
		if _err != nil {
			err = _err
			return
		}

		_err = healthCheck()
		if _err != nil {
			err = _err
			return
		}
	})

	if err != nil {
		return nil, err
	}

	return conn.(*pgxpool.Pool), nil
}
