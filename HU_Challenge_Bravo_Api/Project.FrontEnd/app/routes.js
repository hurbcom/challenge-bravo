
app.config(function ($routeProvider) {

    $routeProvider
        .when(
        '/currency/conversion', //URL
        {
            templateUrl: '/app/views/currency/conversion.html',
            controller: 'currencyConversionController'
        }
        );
});

app.config(function ($locationProvider) {
    $locationProvider.hashPrefix('');
});
