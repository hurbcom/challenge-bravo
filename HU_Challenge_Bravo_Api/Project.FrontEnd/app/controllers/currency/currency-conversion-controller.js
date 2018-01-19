app.controller('CurrencyConversionController',
    function ($scope, $currencyConversionService) {

        $scope.formData = {};

        $scope.convert = function () {

            $currencyConversionService.convert($scope.formData)
                .then(function (d) {

                    $scope.data = d.data;
                })
                .catch(function (e) {

                    $scope.message = e.data;
                });
        }
    }
);