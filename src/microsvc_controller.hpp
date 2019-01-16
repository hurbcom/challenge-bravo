#pragma once

#include <basic_controller.hpp>
#include "models/currency.hpp"

using namespace cfx;

class MicroserviceController : public BasicController, Controller {
private:
    map<string, Currency *> cache;

public:
    MicroserviceController(map<string, Currency *> cache) : cache{cache} {}

    ~MicroserviceController() {}

    void handleGet(http_request request) override;

    void initRestOpHandlers() override;
};