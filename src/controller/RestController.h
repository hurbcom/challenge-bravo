#ifndef CONTROLLER_RESTCONTROLLER_H_
#define CONTROLLER_RESTCONTROLLER_H_

#include <basic_controller.hpp>
#include "../service/CurrencyConverter.h"

using namespace cfx;

class RestController  : public BasicController, Controller {
public:
    RestController() : BasicController() {}
    virtual ~RestController() {}
    void handleGet(http_request message) override;
    void handlePut(http_request message) override {};
    void handlePost(http_request message) override {};
    void handleDelete(http_request message) override {};
    void handlePatch(http_request messge) override {};
    void handleHead(http_request message) override {};
    void handleOptions(http_request message) override {};
    void handleTrace(http_request message) override {};
    void handleConnect(http_request message) override {};
    void handleMerge(http_request message) {};
    void initRestOpHandlers() override;
private:
    CurrencyConverter converter;
};

#endif /* CONTROLLER_RESTCONTROLLER_H_ */
