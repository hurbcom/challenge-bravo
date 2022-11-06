package entities

import (
	"time"
)

type Tweet struct {
	ID int `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
	Text string `json:"text" db:"text"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	ModifiedAt time.Time `json:"modifiedAt" db:"modified_at"`
}

func (tweet *Tweet) IsValid() bool {
	if tweet.Username == "" || tweet.Text == "" {
		return false
	}
	return true
}