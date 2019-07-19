#!/usr/bin/python

import threading, time, signal, sys
from datetime import timedelta

WAIT_TIME_SECONDS = 5

class SigKill(Exception):
	pass

class Job(threading.Thread):
	def __init__(self, interval, execute, *args, **kwargs):
		threading.Thread.__init__(self)
		self.daemon = False
		self.stopped = threading.Event()
		self.interval = interval
		self.execute = execute
		self.args = args
		self.kwargs = kwargs

	def stop(self):
		self.stopped.set()
		self.join()

	def run(self):
		while not self.stopped.wait(self.interval.total_seconds()):
			self.execute(*self.args, **self.kwargs)

def signal_handler(signum, frame):
    raise SigKill
