package scheduler

import (
	"sync"
	"time"

	"github.com/robfig/cron/v3"
)

var (
	once sync.Once
)

type Task struct {
	ID      cron.EntryID `json:"id" example:"1" swaggertype:"integer"`
	Name    string       `json:"name" example:"Currency Updater"`
	PrevRun *time.Time   `json:"prev_run" example:"null"`
	NextRun time.Time    `json:"next_run" example:"2024-09-26T14:39:09Z"`
}

type AvailableTask struct {
	ID      cron.EntryID `json:"-" swaggerignore:"true"`
	Name    string       `json:"name" example:"Currency Updater"`
	Removed bool         `json:"removed" example:"false"`
	LastRun *time.Time   `json:"last_run" example:"2024-09-25T14:39:09Z"`
}

type Scheduler struct {
	cron           *cron.Cron
	tasks          []Task
	availableTasks []AvailableTask
}

var scheduler *Scheduler

func New() *Scheduler {
	once.Do(func() {
		scheduler = &Scheduler{
			cron:           cron.New(),
			tasks:          []Task{},
			availableTasks: []AvailableTask{},
		}
	})

	return scheduler
}
