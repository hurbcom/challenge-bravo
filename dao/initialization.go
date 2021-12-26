package dao

var db DB                // db Database object
var Cache CacheContainer // Cache Object

const (
	Version = "1.0.0" // Version Bravo version
)

// DAO Interface
type DAO interface {
	Initialize(connectionString string) error
	Terminate()
}

// Init Initializes data layer, where dbConnectionString is the postgres connection string
// and cacheConnectionString is the redis connection string
func Init(dbConnectionString, cacheConnectionString string) error {

	// Initialize database connection
	if err := db.Initialize(dbConnectionString); err != nil {
		return err
	}

	// Initialize cache connection
	if err := Cache.Initialize(cacheConnectionString); err != nil {
		db.Terminate()
		return err
	}

	return nil
}

// Terminate Data access objects
func Terminate() {
	db.Terminate()
	Cache.Terminate()
}
