#include <std_micro_service.hpp>
#include "microsvc_controller.hpp"
#include "models/currency.hpp"

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


            auto query_parameters = uri::split_query(request.request_uri().query());

            auto response = json::value::object();
            auto from_currency = cache[query_parameters["from"]];
            auto to_currency = cache[query_parameters["to"]];
            auto amount = boost::lexical_cast<double>(query_parameters["amount"]);

            if(from_currency == NULL || to_currency == NULL) {
                request.reply(status_codes::NotFound);
                return;
            }

            response["result"] = json::value::number(from_currency->value / to_currency->value * amount);

            request.reply(status_codes::OK, response);
        }
    } else {
        request.reply(status_codes::NotFound);
    }
}