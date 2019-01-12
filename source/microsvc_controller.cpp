#include <std_micro_service.hpp>
#include "microsvc_controller.hpp"
#include "models/currency.hpp"
#include <soci/soci.h>
#include <soci/sqlite3/soci-sqlite3.h>

using namespace web;
using namespace http;

void MicroserviceController::initRestOpHandlers() {
    _listener.support(methods::GET, std::bind(&MicroserviceController::handleGet, this, std::placeholders::_1));
}

void MicroserviceController::handleGet(http_request request) {
    auto path = requestPath(request);
    if (!path.empty()) {
        if (path[0] == "convert") {
            Currency cur;

            soci::session sql(*soci::factory_sqlite3(), "/tmp/microservice.db");
            sql << "SELECT currency, value FROM Currency WHERE id=1", soci::into(cur.currency), soci::into(cur.value);

            auto query_parameters = uri::split_query(request.request_uri().query());

            auto response = json::value::object();
            auto from_currency = query_parameters["from"];
            auto to_currency = query_parameters["to"];
            auto amount = boost::lexical_cast<double>(query_parameters["amount"]);

            response["result"] = json::value::number(cur.value * amount);

            request.reply(status_codes::OK, response);
        }
    } else {
        request.reply(status_codes::NotFound);
    }
}