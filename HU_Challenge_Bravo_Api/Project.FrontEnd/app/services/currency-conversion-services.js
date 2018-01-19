
app.service('$currencyConversionService',
    function ($http) {

        var urlBase = "http://localhost:52995/api/currencyConversion";

        var services = {};

        services.convert = function (model) {
            return $http.get(urlBase + "/convert/from/" + model.fromCurrency + "/to/" + model.toCurrency + "/amount/" + model.amount + "/");
        };

        return services;
    });