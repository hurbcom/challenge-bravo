#include "RestController.h"

#include "../model/CurrencyConversion.h"

#include <cstdlib>
#include <utility>

using namespace std;

void RestController::handleGet(http_request message) {
	// Create a new task and waits data to become available so when can extract json
	message.extract_json().then([=](json::value request) {
		try {
			// Check request path is equal to "convert"
			auto path = requestPath(message);
			if (path.empty() || path.size() > 1 || path[0] != "convert") {
				message.reply(status_codes::NotFound);
				return;
			}

			// Retrieve currency conversion info from request query
			auto query = message.request_uri().split_query(message.request_uri().query());
			if (query.size() != 3) {
				throw::invalid_argument("Expected query arguments: from, to, amount");
			}
			string from{query.at("from")}, to{query.at("to")}, amount{query.at("amount")};

			// Convert amount from a currency to another
			CurrencyConversion conversion(from, to, amount);
			double value = converter.convert(conversion);

			// Return response values
			json::value body;
			body["from"] = json::value::string(from);
			body["to"] = json::value::string(to);
			body["amount"] = json::value::number(atof(amount.c_str()));
			body["value"] = json::value::number(value);
			http_response response;
			response.set_body(body);
			response.set_status_code(status_codes::OK);
			response.headers().add("Access-Control-Allow-Origin","*");
			message.reply(response);
		} catch(out_of_range &e) {
			message.reply(status_codes::BadRequest, e.what());
			cerr << "Bad request: " << e.what() << endl;
		} catch(invalid_argument &e) {
			message.reply(status_codes::BadRequest, e.what());
			cerr << "Bad request: " << e.what() << endl;
		} catch(json::json_exception &e) {
			message.reply(status_codes::BadRequest);
			cerr << "Bad request: " << e.what() << endl;
		} catch(CurrencyConverterException &e) {
			message.reply(status_codes::ServiceUnavailable, e.what());
			cerr << "Service unavailable: " << e.what() << endl;
		} catch(...) {
			message.reply(status_codes::InternalError);
			cerr << "Unexpected error" << endl;
		}
	});
}

void RestController::initRestOpHandlers() {
	// Here we must bind every supported http method to its related handler.
	_listener.support(methods::GET, std::bind(&RestController::handleGet, this, std::placeholders::_1));
	converter.getCachedOrOnlineValue("BRL");
	converter.getCachedOrOnlineValue("EUR");
	converter.getCachedOrOnlineValue("BTC");
	converter.getCachedOrOnlineValue("ETH");
}
