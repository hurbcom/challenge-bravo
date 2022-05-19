package config

import "errors"

var gitCommitHash string

type Version struct {
	GitCommitHash string
}

func NewVersion() *Version {
	return &Version{
		GitCommitHash: gitCommitHash,
	}
}

var (
	ErrVersionTypeAssertion = errors.New("cannot type assert version interface{} -> *config.Version")
)
