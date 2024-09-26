package scheduler

func (s *Scheduler) GetAllAvailableTasks() []AvailableTask {
	return s.availableTasks
}
