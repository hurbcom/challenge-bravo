app.controller('CurrencyConversionController',
    function ($scope, $currencyConversionService) {

        $scope.formData = {};

        $scope.convert = function (scope) {

            if (!scope.fromCurrency || !scope.toCurrency || !scope.amount) {

                return;
            }
            else {

                $scope.message = "Sending data...";

                $currencyConversionService.convert($scope.formData)
                    .then(function (d) {

                        $scope.data = d.data;
                        $scope.message = "";
                    })
                    .catch(function (e) {

                        $scope.message = e.data;
                    });
            }
        }
    }
);