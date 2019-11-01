"use strict";

// Helper interface
module.exports = {
    rejection: rejection_handler,
    exception: exception_handler,
    controller: controller_handler
};

// Helper methods
function rejection_handler(reason, promise) {
    throw reason;
}

function exception_handler(error) {
    process.exit(1);
}

function controller_handler(error, response) {
    response.status(500).send(error);
}