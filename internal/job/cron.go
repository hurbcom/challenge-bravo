package job

import (
	"context"
	"github.com/joaohgf/challenge-bravo/internal/action"
	"github.com/joaohgf/challenge-bravo/internal/repository"
	"github.com/robfig/cron/v3"
)

// Job is the job to be runned by the cron
type Job struct {
	Action action.Action
}

// NewJob creates a new job
func NewJob(repository *repository.Engine) *Job {
	return &Job{Action: action.NewUpdate(repository)}
}

// Run runs the jobs
func (j *Job) Run(ctx context.Context) {
	var c = cron.New(cron.WithChain())
	var _, err = c.AddFunc("@every 30m", func() {
		// job to update or create the currency
		go j.Action.Act(ctx)
	})
	if err != nil {
		c.Stop()
	}
	c.Start()
}
