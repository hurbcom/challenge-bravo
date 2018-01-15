#include <usr_interrupt_handler.hpp>
#include <runtime_utils.hpp>

#include "controller/RestController.h"

#include <iostream>
using namespace std;

int main(int argc, const char * argv[]) {
	// Hook on the SIGINT interrupt to handle the CTRL+C
	InterruptHandler::hookSIGINT();

	// If you pass host_auto_ip4 or host_auto_ip6 means the service should
	// auto detect the IP address of the host, if you have more than one
	// network cards it will use the first one it finds in the list of
	// available IP addresses
	RestController server;
	server.setEndpoint("http://host_auto_ip4:8000");

	try {
		// Initialize the thread pool that is used by PPLX Concurrency Runtime
		// and start accepting network connections
		// Reference: https://microsoft.github.io/cpprestsdk/namespacepplx.html
		server.accept().wait();

		// At this point you should see about 40 or so threads on the service process,
		// that constitutes the thread pool hosted by the pplx scheduler.
		// Those threads are pre-spawned to avoid delays when a thread is required
		// and they are re-used during the service life time.
		// So nothing to be scared of. :)
		cout << "Currency Conversion Service now listening for requests at: " << server.endpoint() << endl;

		// Setup a barrier to avoid the process to finish,
		// leaving the acceptor die before any request can be processed
		InterruptHandler::waitForUserInterrupt();

		// Shutdown the service and wait for all threads to finish
		server.shutdown().wait();
	} catch (std::exception & e) {
		cerr << "Oh no! [" << e.what() << "]" << endl;
	} catch (...) {
		RuntimeUtils::printStackTrace();
	}

	return 0;
}
