package testutils

func AfterAll() {
	for _, container := range runningContainers {
		container.Terminate()
	}
}
