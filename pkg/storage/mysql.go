package storage

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	ErrorConnectingMysql = "Error connecting to storage. "
)

func connect(userPass, schema, hostAndPort string) (*gorm.DB, error) {
	connURL := fmt.Sprintf("%s@tcp(%s)/%s?charset=utf8&parseTime=True&loc=Local&timeout=10s", userPass, hostAndPort, schema)
	return gorm.Open(mysql.Open(connURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
}

// RawConnectMysql - connect without a schema
func RawConnectMysql(userPass, host string) *gorm.DB {
	dbConn, err := connect(userPass, "", host)
	if err != nil {
		log.Println(ErrorConnectingMysql + err.Error())
		return nil
	}
	return dbConn
}

// Connect to database
func ConnectMysql(userPass, schema, host string) (*gorm.DB, error) {
	dbConn, err := connect(userPass, schema, host)
	if err != nil {
		return nil, err
	}
	return dbConn, nil
}

// Close -
func Close(db *gorm.DB, now bool) {
	sqlDB, _ := db.DB()
	if now {
		sqlDB.Close()
		return
	}
	defer sqlDB.Close()
}
