package scheduler

import (
	"slices"
)

func (s *Scheduler) GetAllTasks() []Task {
	cronEntries := s.cron.Entries()

	for _, v := range cronEntries {
		for i, v2 := range s.tasks {
			if v.ID == v2.ID {
				s.tasks[i].PrevRun = &v.Prev
				if v.Prev.IsZero() {
					s.tasks[i].PrevRun = nil
				}
				s.tasks[i].NextRun = v.Next
			}
		}
	}

	tasks := slices.Clone(s.tasks)

	return tasks
}
