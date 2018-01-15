#pragma once

#include <cpprest/http_client.h>

using namespace web::http;
using namespace web::http::client;
using namespace std;

class HttpClient : public http_client {
private:
	string _url;
public:
	HttpClient() = delete;
	HttpClient(string url) : _url(url), http_client(url) {};
	virtual http_response get(string currency) {
		pplx::task<http_response> task = request(methods::GET, uri_builder("/data/price").append_query("fsym", "USD").append_query("tsyms", currency).to_string());
		return task.get();
	}
	virtual ~HttpClient() {};
};
