package entity

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
)

type User struct {
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	Active    *bool     `json:"active,omitempty"`
	FirstName string
	LastName  string
	Password  string
	Email     string
	Role      enum.Role
	ID        int `json:"id,omitempty"`
}

type UserRepository interface {
	WithTx(pgx.Tx) UserRepository
	Create(context.Context, User) (User, error)
	Update(context.Context, User) error
	GetOneByEmail(context.Context, string) (*User, error)
	GetOneById(context.Context, int) (*User, error)
}
