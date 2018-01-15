#pragma once

#include "gmock/gmock.h"
#include "service/HttpClient.h"

class mockHttpClient : public HttpClient {
public:
	MOCK_METHOD1(get, http_response(string));
	mockHttpClient() : HttpClient("http://127.0.1.1") {};
	virtual ~mockHttpClient() {};
};
