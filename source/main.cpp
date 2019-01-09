
#include <iostream>

#include <usr_interrupt_handler.hpp>
#include <runtime_utils.hpp>

#include "microsvc_controller.hpp"
#include <boost/di.hpp>

using namespace web;
using namespace cfx;

int main(int argc, const char *argv[]) {
    InterruptHandler::hookSIGINT();

    MicroserviceController server;
    server.setEndpoint("http://host_auto_ip4:6502/v1/service/api");

    try {
        server.accept().wait();
        std::cout << "Listening on: " << server.endpoint() << '\n';

        InterruptHandler::waitForUserInterrupt();

        server.shutdown().wait();
    }
    catch (std::exception &e) {
        std::cerr << "Initialization error: " << '\n';
        std::cerr << e.what();
    }
    catch (...) {
        RuntimeUtils::printStackTrace();
    }

    return 0;
}
