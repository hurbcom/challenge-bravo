#include "../allTests/testRestController.h"

testRestController::testRestController() {
	server.setEndpoint("http://localhost:8001");
	server.accept().wait();
}

testRestController::~testRestController() {
	server.shutdown();
}

TEST_F(testRestController, GetHandlerIsFilteringPath) {
	http_response response;
	http_client client("http://localhost:8001");

	response = client.request(methods::GET, uri_builder("/convert").append_query("from", "USD").append_query("to", "BRL").append_query("amount", "99.99").to_string()).get();
	EXPECT_EQ(response.status_code(), 200);

	response = client.request(methods::GET, uri_builder("/convert/foo").append_query("from", "USD").append_query("to", "BRL").append_query("amount", "99.99").to_string()).get();
	EXPECT_EQ(response.status_code(), 404);

	response = client.request(methods::GET, uri_builder("/foo").append_query("from", "USD").append_query("to", "BRL").append_query("amount", "99.99").to_string()).get();
	EXPECT_EQ(response.status_code(), 404);

	response = client.request(methods::GET, uri_builder("/").append_query("from", "USD").append_query("to", "BRL").append_query("amount", "99.99").to_string()).get();
	EXPECT_EQ(response.status_code(), 404);
}

TEST_F(testRestController, GetHandlerIsFilteringQueryArguments) {
	http_response response;
	http_client client("http://localhost:8001");

	response = client.request(methods::GET, uri_builder("/convert").append_query("from", "USD").append_query("to", "BRL").append_query("amount", "99.99").to_string()).get();
	EXPECT_EQ(response.status_code(), 200);

	response = client.request(methods::GET, uri_builder("/convert").append_query("from", "USD").append_query("to", "BRL").append_query("foo", "99.99").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);

	response = client.request(methods::GET, uri_builder("/convert").append_query("from", "USD").append_query("foo", "BRL").append_query("amount", "99.99").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);

	response = client.request(methods::GET, uri_builder("/convert").append_query("foo", "USD").append_query("to", "BRL").append_query("amount", "99.99").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);

	response = client.request(methods::GET, uri_builder("/convert").append_query("from", "USD").append_query("to", "BRL").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);

	response = client.request(methods::GET, uri_builder("/convert").append_query("from", "USD").append_query("amount", "BRL").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);

	response = client.request(methods::GET, uri_builder("/convert").append_query("to", "USD").append_query("amount", "BRL").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);

	response = client.request(methods::GET, uri_builder("/convert").append_query("to", "USD").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);

	response = client.request(methods::GET, uri_builder("/convert").append_query("from", "USD").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);

	response = client.request(methods::GET, uri_builder("/convert").append_query("amount", "USD").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);

	response = client.request(methods::GET, uri_builder("/convert").append_query("from", "USD").append_query("to", "BRL").append_query("amount", "99.99").append_query("foo", "bar").to_string()).get();
	EXPECT_EQ(response.status_code(), 400);
}

TEST_F(testRestController, GetHandlerIsReturningExpectedFields) {
	http_response response;
	http_client client("http://localhost:8001");

	response = client.request(methods::GET, uri_builder("/convert").append_query("from", "USD").append_query("to", "BRL").append_query("amount", "99.99").to_string()).get();
	auto json = response.extract_json().get();

	EXPECT_TRUE(json.has_field("from"));
	EXPECT_TRUE(json.has_field("to"));
	EXPECT_TRUE(json.has_field("amount"));
	EXPECT_TRUE(json.has_field("value"));
	EXPECT_EQ(json.size(), 4);
}
