#pragma once

#include <basic_controller.hpp>

using namespace cfx;

class MicroserviceController : public BasicController, Controller {
public:
    MicroserviceController() : BasicController() {}
    ~MicroserviceController() {}
    void handleGet(http_request request) override;
    void initRestOpHandlers() override;
};