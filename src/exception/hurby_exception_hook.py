import sys
import threading
from src.service.logger_service import Logger


class HurbyExceptionHook:
    def __init__(self, config):
        self.logger = Logger(config=config, name="analytical", file_name="error.log").log

    @staticmethod
    def install_thread_except_hook():
        """
        Install thread excepthook.

        By default, all exceptions raised in thread run() method are caught internally
        by the threading module (see _bootstrap_inner method). Current implementation
        simply dumps the traceback to stderr and did not exit the process.

        This change explicitly catches exceptions and invokes sys.excepthook handler.
        """
        _init = threading.Thread.__init__

        def init(self, *args, **kwargs):
            _init(self, *args, **kwargs)
            _run = self.run

            def run(*args, **kwargs):
                try:
                    _run(*args, **kwargs)
                except:
                    sys.excepthook(*sys.exc_info())
            self.run = run

        threading.Thread.__init__ = init

    def custom_except_hook(self, exc_type, exc_value, traceback):
        """
        Intended to be assigned to sys.exception as a hook.
        Gives programmer opportunity to do something useful with info from uncaught exceptions.

        Parameters
        exc_type: Exception type
        exc_value: Exception's value
        traceback: Exception's traceback
        """

        self.logger.exception(exc_value)
