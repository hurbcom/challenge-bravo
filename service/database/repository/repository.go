package repository

type Repository interface {
	Currency() Currency
	Check() error
	Close() error
}

// ErrDuplicateKey denotes failing repository duplicate key.
type ErrDuplicateKey struct {
	Message string
}

// ErrDuplicateKey returns the repository error duplicate key message.
func (edk ErrDuplicateKey) Error() string {
	return edk.Message
}

// ErrNotFound denotes failing repository not found.
type ErrNotFound struct {
	Message string
}

// ErrNotFound returns the repository error not found.
func (enf ErrNotFound) Error() string {
	return enf.Message
}
