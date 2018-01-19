
app.config(function ($routeProvider) {

    $routeProvider
        .when(
        '/currency/conversion', //URL
        {
            templateUrl: '/app/views/currency/conversion.html',
            controller: 'CurrencyConversionController'
        }
        );
});

app.config(function ($locationProvider) {
    $locationProvider.hashPrefix('');
});
