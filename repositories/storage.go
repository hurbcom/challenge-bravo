package repositories

// Repository is the interface for using a storage to the usecases
type Repository interface {
	Connect() error
	FindIfPresent(symbol string) float64
	IsAllowed(symbol string) bool
	RemoveFromAllowedList(symbol string) error
	AddToCacheList(symbol string, value float64) error
	AddToAllowedList(symbol string) error
}
