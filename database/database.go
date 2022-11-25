package database

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/mysqldialect"
	"github.com/uptrace/bun/extra/bundebug"
)

func Connect() (*sql.DB, *bun.DB, error) {
	// to connect on another database, just follow the string below with the standart
	//"Username:password@/database?charset=utf8&parseTime=True&loc=Local"

	/*--Script to create database and table on mysql--*/
	/*
		create database bravo;
		use bravo;
		create table currency(
		id int auto_increment primary key,
		name varchar (50) not null,
		tousd float (20,2) not null
		)ENGINE=INNODB;

	*/

	strConn := "Ricardo_Sales:mysql@/bravo?charset=utf8&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", strConn)
	if err != nil {
		log.Fatal(err.Error())
		return nil, nil, err
	}
	if err = db.Ping(); err != nil {
		log.Fatal(err.Error())
		return nil, nil, err
	}
	dbun := bun.NewDB(db, mysqldialect.New())
	dbun.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))
	return db, dbun, nil
}
