#pragma once

#include "gtest/gtest.h"
#include "controller/RestController.h"
#include <cpprest/http_client.h>

using namespace web::http;
using namespace web::http::client;

class testRestController : public ::testing::Test {
private:
	RestController server;
protected:
	testRestController();
	virtual ~testRestController();
};

