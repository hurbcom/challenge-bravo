package scheduler

import "slices"

func (s *Scheduler) AddTask(name, spec string, fn func()) error {
	taskID, err := s.cron.AddFunc(spec, fn)
	if err != nil {
		return err
	}

	task := s.cron.Entry(taskID)

	s.tasks = append(s.tasks, Task{
		ID:      taskID,
		Name:    name,
		PrevRun: &task.Prev,
		NextRun: task.Next,
	})

	AvailableTaskIndex := slices.IndexFunc(s.availableTasks, func(e AvailableTask) bool {
		return e.Name == name
	})

	isANewTask := AvailableTaskIndex == -1

	if isANewTask {
		s.availableTasks = append(s.availableTasks, AvailableTask{
			ID:      taskID,
			Name:    name,
			LastRun: nil,
			Removed: false,
		})
	} else {
		s.availableTasks[AvailableTaskIndex].LastRun = nil
		s.availableTasks[AvailableTaskIndex].Removed = false
	}

	return nil
}
