package cache

type Config struct {
	Host     string `json:"host"`
	Password string `json:"password"`
	Port     int    `json:"port"`
	Database int    `json:"database"`
}
