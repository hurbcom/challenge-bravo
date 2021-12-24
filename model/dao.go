package model

import (
	"context"
	"encoding/json"
	"github.com/Masterminds/squirrel"
	"github.com/georgysavva/scany/pgxscan"
	"log"
	"reflect"
)

type XDAO interface {
	Save() error
	List(values interface{}) error
	String() string
}

type daoHelper struct {
}

func (helper *daoHelper) list(builder *squirrel.SelectBuilder, values interface{}, cacheKey func(interface{}) string) error {

	// Create query
	query, args, err := builder.ToSql()
	if err != nil {
		log.Println(err)
		return err
	}

	// Execute query
	if err = pgxscan.Select(context.Background(), db.poll, values, query, args...); err != nil {
		log.Println(err)
		return err
	}

	// Refreshes the cache
	slice := reflect.Indirect(reflect.ValueOf(values))
	if slice.Kind() == reflect.Slice {
		for i := 0; i < slice.Len(); i++ {
			entity := slice.Index(i).Interface()
			if err = BCache.Set(cacheKey(entity), entity, defaultCacheTime); err != nil {
				log.Println(err)
				return err
			}
		}
	}

	return nil
}

func (helper *daoHelper) save(builder *squirrel.InsertBuilder, cacheKey string, cacheValue interface{}) error {

	// Create the query
	query, args, err := builder.ToSql()
	if err != nil {
		log.Println(err)
		return err
	}

	// Transaction start
	tx, err := db.poll.Begin(context.Background())
	if err != nil {
		log.Println(err)
		return err
	}

	// Execute the query
	if _, err = tx.Exec(context.Background(), query, args...); err != nil {
		log.Println(err)
		if errTx := tx.Rollback(context.Background()); errTx != nil {
			log.Println(errTx)
		}
		return err
	}

	// Update cache value if a key was provided
	if len(cacheKey) > 0 {
		if err = BCache.Set(cacheKey, cacheValue, defaultCacheTime); err != nil {
			log.Println(err)
			if errTx := tx.Rollback(context.Background()); errTx != nil {
				log.Println(errTx)
			}
			return err
		}
	}

	// Commit transaction
	if err = tx.Commit(context.Background()); err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func (helper *daoHelper) string(value interface{}) string {
	out, err := json.Marshal(value)
	if err != nil {
		log.Println(err)
		return ""
	}
	return string(out)
}
