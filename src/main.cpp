
#include <iostream>

#include <usr_interrupt_handler.hpp>
#include <runtime_utils.hpp>

#include "microsvc_controller.hpp"
#include "soci/boost-tuple.h"

#include <soci/soci.h>
#include <soci/sqlite3/soci-sqlite3.h>

using namespace web;
using namespace cfx;

int main(int argc, const char *argv[]) {
    InterruptHandler::hookSIGINT();

    soci::session sql(*soci::factory_sqlite3(), "/tmp/microservice.db");

    map<string, Currency *> cache;

    soci::rowset<boost::tuple<string, double>> rowset = (sql.prepare
            << "SELECT currency, value FROM Currency");

    cache["USD"] = new Currency("USD", 1);

    for (auto &r : rowset) {
        boost::tuple<string, double> record = r;
        cache[record.get<0>()] = new Currency(record.get<0>(), record.get<1>());
    }

    MicroserviceController* server = new MicroserviceController(cache);
    server->setEndpoint("http://host_auto_ip4:6502/v1/service/api");


    try {
        server->accept().wait();
        std::cout << "Listening on: " << server->endpoint() << '\n';

        InterruptHandler::waitForUserInterrupt();

        server->shutdown().wait();
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
