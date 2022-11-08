package entities

type Config struct {
	Database  DatabaseConfig
	TimeZone  string
	SecretKey string
}

type DatabaseConfig struct {
	Host     string
	Port     int
	DbName   string
	Username string
	Password string
}