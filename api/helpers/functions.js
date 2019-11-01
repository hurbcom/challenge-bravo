"use strict";

// Helper interface
module.exports = {
    get_request_parameter: get_request_parameter,
    response_array_list: response_array_list,
    response_register: response_register,
    init_search_filter: init_search_filter
};

function get_request_parameter(request, parameter) {
    return (request.swagger.params[parameter]) ?
    request.swagger.params[parameter].value : null;
}

function response_array_list(registers, response) {
    if(Array.isArray(registers) && registers.length)
        response.json(registers);
    else
        response.status(204).send();
}

function response_register(register, response, not_found_message) {
    if(register)
        response.json(register);
    else
        response.status(404).send(not_found_message);
}

function init_search_filter() {
    return { where: {}, attributes: {} };
}