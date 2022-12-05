package models

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/Ricardo-Sales/challenge-bravo/cerrors"
	"github.com/Ricardo-Sales/challenge-bravo/database"
	"github.com/uptrace/bun"
)

type Currency struct {
	bun.BaseModel `bun:"table:currency,alias:cr"`

	ID         uint32     `json:"id" bun:"id,pk,autoincrement"`
	Code       string     `json:"code" validate:"required,min=3,max=4" bun:"code,notnull"`
	Name       string     `json:"name" validate:"required" bun:"name,notnull"`
	ToUsd      string     `json:"tousd" validate:"required" bun:"tousd,notnull"`
	Type       string     `json:"type" validate:"required,len=3" bun:"type,notnull"`
	CreateDate *time.Time `json:"create_date" bun:"create_date"`
	UpdateDate *time.Time `json:"update_date,omitempty" bun:"update_date,nullzero,default:on update current_timestamp()"`
}

func GetAll() ([]Currency, error) {
	ctx := context.Background()

	var crs []Currency
	var err error

	_, dbun, err := database.Connect()
	if err != nil {
		return nil, err
	}
	defer dbun.Close()
	defer ctx.Done()

	err = dbun.NewSelect().Model(&crs).Scan(ctx)
	if err != nil {
		return nil, err
	}
	return crs, err
}

func (cr *Currency) Save() error {
	ctx := context.Background()

	_, dbun, err := database.Connect()
	if err != nil {
		return err
	}
	defer dbun.Close()
	defer ctx.Done()

	tx, err := dbun.BeginTx(ctx, &sql.TxOptions{})
	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.NewInsert().Model(cr).Exec(ctx)
	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.NewSelect().Model(cr).Where("id=?", cr.ID).Scan(ctx)
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}

func (cr *Currency) GetOne() error {

	ctx := context.Background()
	_, dbun, err := database.Connect()
	if err != nil {
		return err
	}
	defer dbun.Close()
	defer ctx.Done()

	rows, err := dbun.NewSelect().Model(cr).Where("id = ?", cr.ID).ScanAndCount(ctx)
	if rows == 0 {
		return errors.New(cerrors.ErrResourceNotFound)
	}
	if err != nil {
		return err
	}

	return nil
}

func (cr *Currency) Update() error {
	ctx := context.Background()
	_, dbun, err := database.Connect()
	if err != nil {
		return err
	}
	defer dbun.Close()
	defer ctx.Done()

	tx, err := dbun.BeginTx(ctx, &sql.TxOptions{})
	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.NewUpdate().
		Model(cr).
		ExcludeColumn("create_date").
		Set("code=?", cr.Code).
		Set("name=?", cr.Name).
		Set("tousd=?", cr.ToUsd).
		Set("update_date=?", time.Now().UTC()).
		WherePK().
		Exec(ctx)
	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.NewSelect().
		Model(cr).
		Where("id = ?", cr.ID).
		Scan(ctx)
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}

func (cr *Currency) Delete() error {
	ctx := context.Background()
	_, dbun, err := database.Connect()
	if err != nil {
		return err
	}
	defer dbun.Close()
	defer ctx.Done()

	tx, err := dbun.BeginTx(ctx, &sql.TxOptions{})
	if err != nil {
		tx.Rollback()
		return err
	}
	_, err = tx.NewDelete().Model(cr).WherePK().Exec(ctx)

	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}

func (cr *Currency) GetOneByCode() error {

	ctx := context.Background()
	_, dbun, err := database.Connect()
	if err != nil {
		return err
	}
	defer dbun.Close()
	defer ctx.Done()

	rows, err := dbun.NewSelect().Model(cr).Where("code = ?", cr.Code).ScanAndCount(ctx)
	if rows == 0 {
		return errors.New(cerrors.ErrResourceNotFound)
	}
	if err != nil {
		return err
	}

	return nil

}
