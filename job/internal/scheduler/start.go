package scheduler

func (s *Scheduler) Start() {
	s.cron.Start()
}
