package model

var db DB        // db Database object
var BCache Cache // BCache Object

const (
	Version = "1.0.0" // Version Bravo version
)

// DAO Interface methods
type DAO interface {
	Initialize(connectionString string) error
	Terminate()
}

// Init Initializes data layer, where dbConnectionString is the postgres connection string
// and cacheConnectionString is the redis connection string
func Init(dbConnectionString, cacheConnectionString string) error {

	if err := db.Initialize(dbConnectionString); err != nil {
		return err
	}

	if err := BCache.Initialize(cacheConnectionString); err != nil {
		db.Terminate()
		return err
	}

	return nil
}

// Terminate data layer
func Terminate() {
	db.Terminate()
	BCache.Terminate()
}
