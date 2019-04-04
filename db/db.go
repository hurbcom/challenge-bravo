package db

type Database interface {
	Connect()
	HMGet(args []interface{}) ([]float64, error)
	HMSet(args []interface{}) error
}
