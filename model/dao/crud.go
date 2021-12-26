package dao

import (
	"context"
	"encoding/json"
	"github.com/Masterminds/squirrel"
	"github.com/georgysavva/scany/pgxscan"
	"log"
	"reflect"
)

// CRUD Interface for model objects
type CRUD interface {

	// New Creates a new entity without updating
	New() *Error

	// Save Creates or update a new entity
	Save() *Error

	// List all database entities
	List(values interface{}) error

	// Validate Entity business rules
	Validate() *Error

	// String Print a JSON string entity string representation
	String() string
}

// Helper CRUD methods for common functions
type Helper struct {
}

// List entities from database and refreshes the cache. Where builder is the select query builder to be executed,
// values is the vector point where the results will be returned and cacheKey is the function that generates cache keys
// it will receive as parameter the current entity and should return it cache key
func (helper *Helper) List(builder *squirrel.SelectBuilder, values interface{}, cacheKey func(interface{}) string) error {

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
			if err = Cache.Set(cacheKey(entity), entity, DefaultCacheTime); err != nil {
				log.Println(err)
				return err
			}
		}
	}

	return nil
}

// Save an entity to database and cache. Where builder is the insert query builder to be executed, cacheKey is the
// entity cache key and cacheValue is the entity pointer to be stored on the cache
func (helper *Helper) Save(builder *squirrel.InsertBuilder, cacheKey string, cacheValue interface{}) error {

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
		if err = Cache.Set(cacheKey, cacheValue, DefaultCacheTime); err != nil {
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

// String Generates an entity JSON string representation
func (helper *Helper) String(value interface{}) string {
	out, err := json.Marshal(value)
	if err != nil {
		log.Println(err)
		return ""
	}
	return string(out)
}

// Save an entity to database. Where builder is the insert query builder to be executed
func Save(builder *squirrel.InsertBuilder) error {

	// Create the query
	query, args, err := builder.ToSql()
	if err != nil {
		log.Println(err)
		return err
	}

	// Execute the query
	if _, err = db.poll.Exec(context.Background(), query, args...); err != nil {
		log.Println(err)
		return err
	}

	return nil
}
