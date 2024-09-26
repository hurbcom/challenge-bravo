package scheduler

import (
	"slices"

	"github.com/robfig/cron/v3"
)

func (s *Scheduler) RemoveTask(taskID cron.EntryID) {
	var index int
	var find bool

	for i, v := range s.tasks {
		if v.ID == taskID {
			index = i
			find = true
			break
		}
	}

	if !find {
		return
	}

	availableTaskIndex := slices.IndexFunc(s.availableTasks, func(e AvailableTask) bool {
		return e.Name == s.tasks[index].Name
	})

	tasks := s.GetAllTasks()

	taskIndex := slices.IndexFunc(tasks, func(e Task) bool {
		return e.Name == s.tasks[index].Name
	})

	s.availableTasks[availableTaskIndex].LastRun = tasks[taskIndex].PrevRun
	s.availableTasks[availableTaskIndex].Removed = true

	s.tasks = slices.Delete(s.tasks, index, index+1)

	s.cron.Remove(taskID)
}
