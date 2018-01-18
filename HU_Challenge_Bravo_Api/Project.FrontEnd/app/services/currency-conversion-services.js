
app.service('$clienteService',
    function ($http) {

        var urlBase = "http://http://localhost:52995/api/currencyConversion";

        var services = {};

        services.convert = function (fromCurrency, toCurrency, amount) {
            return $http.get(urlBase + "/convert/from/" + fromCurrency + "/to/" + toCurrency + "/amount/" + amount + "/");
        };

        return services;
    });