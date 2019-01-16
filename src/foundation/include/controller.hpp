#pragma once

#include <cpprest/http_msg.h>

using namespace web;
using namespace http;

namespace cfx {
    class Controller {
    public: 
        virtual void handleGet(http_request message) = 0;
    };
}