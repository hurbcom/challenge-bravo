package errors

import "fmt"

type StorageError struct {
	Entity string
}

func (s *StorageError) Error() string {
	return fmt.Sprintf("%s had a database error", s.Entity)
}
