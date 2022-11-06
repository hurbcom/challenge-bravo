package repositories

import (
	"errors"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/jmoiron/sqlx"
)

type tweetRepository struct {
	db *sqlx.DB
}

type TweetRepository interface {
	GetAllTweets() (*[]entities.Tweet, error)
	GetTweetByID(id int) (*entities.Tweet, error)
	SearchTweetByText(text string) (*[]entities.Tweet, error)
	CreateTweet(tweet *entities.Tweet) error
	UpdateTweet(tweet *entities.Tweet) error
	DeleteTweet(id int) error
}

func InitializeTweetRepository(db *sqlx.DB) TweetRepository {
	return &tweetRepository{db}
}

func (repository *tweetRepository) GetAllTweets() (*[]entities.Tweet, error) {
	var result []entities.Tweet
	rows, err := repository.db.Queryx(`SELECT id, username, text, created_at, modified_at FROM tweets`)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var tweet entities.Tweet
		err = rows.StructScan(&tweet)
		if err != nil {
			return nil, err
		}
		result = append(result, tweet)
	}

	return &result, err
}

func (repository *tweetRepository) GetTweetByID(id int) (*entities.Tweet, error) {
	var tweet entities.Tweet

	err := repository.db.Get(&tweet, `SELECT id, username, text, created_at, modified_at FROM tweets WHERE id=$1;`, id)
	if err != nil {
		return nil, err
	}

	return &tweet, nil
}

func (repository *tweetRepository) SearchTweetByText(text string) (*[]entities.Tweet, error) {
	var result []entities.Tweet

	rows, err := repository.db.Queryx(`SELECT id, username, text, created_at, modified_at FROM tweets WHERE text ILIKE $1;`, text)
	for rows.Next() {
		var tweet entities.Tweet
		err = rows.StructScan(&tweet)
		result = append(result, tweet)
	}

	return &result, err
}

func (repository *tweetRepository) CreateTweet(tweet *entities.Tweet) error {
	var err error

	if tweet == nil {
		return errors.New("tweet can not be nil")
	}

	tx, err := repository.db.Beginx()
	if err != nil {
		return err
	} else {
		err = insertTweet(tx, tweet)
		if err != nil {
			return err
		}
	}

	if err == nil {
		tx.Commit()
	} else {
		tx.Rollback()
	}

	return err
}

func insertTweet(tx *sqlx.Tx, tweet *entities.Tweet) error {
	_, err := tx.NamedExec(`
		INSERT INTO tweets(username, text)
		VALUES (:username, :text);
	`, tweet)

	return err
}

func (repository *tweetRepository) UpdateTweet(tweet *entities.Tweet) error {
	var err error

	tx, errTx := repository.db.Beginx()
	if errTx != nil {
	} else {
		err = updateTweet(tx, tweet)
		if err != nil {
		}
	}

	if err == nil {
		tx.Commit()
	} else {
		tx.Rollback()
	}

	return err
}

func updateTweet(tx *sqlx.Tx, tweet *entities.Tweet) error {
	_, err := tx.NamedExec(`
		UPDATE tweets
		SET username=:username,
		    text=:text,
		    modified_at=:modified_at
		WHERE id=:id;
	`, tweet)

	return err
}

func (repository *tweetRepository) DeleteTweet(id int) error {
	var err error

	tx, errTx := repository.db.Beginx()
	if errTx != nil {
	} else {
		err = deleteTweet(tx, id)
		if err != nil {
		}
	}

	if err == nil {
		tx.Commit()
	} else {
		tx.Rollback()
	}

	return err
}

func deleteTweet(tx *sqlx.Tx, id int) error {
	_, err := tx.Exec(`
		DELETE FROM tweets WHERE id=$1;
	`, id)

	return err
}
