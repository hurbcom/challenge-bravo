var loadingImg = 'images/loading.gif';
var loaderImg = 'images/Loader.gif';
var appExchangeRate = angular.module( 'appExchangeRate', ['cur.$mask'] );
appExchangeRate.controller( 'exchangeRateCtrl', ['$scope', '$http', function( $scope, $http )
{
    $scope.Message = '';
    $scope.Color = '';
    $scope.displayLoading = false;
    $scope.ExchangeRates = [];
    $scope.ListCurrencyCodes = [];
    $scope.CurrencyCodes = [];
    $scope.Currency = {
        from: 'USD',
        to: 'all',
        amount: ''
    };

    // Disable equivalent currency code in select from
    $scope.disableCurrencyCode = function()
    {
        $( '#currency-to' ).children( 'option' ).each( function()
        {
            $( this ).prop( "disabled", false );
            if ( $( this ).val() === $scope.Currency.from )
            {
                $( this ).prop( "disabled", true );
            }
        });
    };

    // Get available currency codes to mount select
    $scope.getListCurrencyCodes = function()
    {
        $scope.ListCurrencyCodes = [];
        $http( {
            url: '/currency-code-list',
            method: 'GET'
        } ).then( function success( result )
        {
            if ( typeof result.data.data !== 'undefined' && result.data.data.length > 0 )
            {
                if ( angular.isArray( result.data.data ) )
                {
                    $scope.ListCurrencyCodes = result.data.data;
                }
            }
            else
            {
                $scope.Message = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
                $scope.Color = 'danger';
            }
        }, function error( error )
        {
            $scope.Message = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
            $scope.Color = 'danger';
        });
    };

    // Get exchange rates
    $scope.getExchangeRate = function()
    {
        $scope.Message = '';
        $scope.displayLoading = true;
        $scope.ExchangeRates = [];
        $http( {
            url: '/api/exchange-rates?from=' + $scope.Currency.from + '&to=' + $scope.Currency.to + '&amount=' + $scope.Currency.amount,
            method: 'GET'
        } ).then( function success( result )
        {
            $scope.displayLoading = false;
            if ( typeof result.data.data !== 'undefined' && result.data.data.length > 0 )
            {
                if ( angular.isArray( result.data.data ) )
                {
                    $scope.ExchangeRates = result.data.data;
                }
            }
            else
            {
                $scope.Message = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
                $scope.Color = 'danger';
            }
        }, function error( error )
        {
            $scope.displayLoading = false;
            $scope.Message = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
            $scope.Color = 'danger';
        });
    };

    // Initialize select currency codes
    $scope.getListCurrencyCodes();
}]).controller( 'currencyCodesCtrl', ['$scope', '$http', function( $scope, $http )
{
    $scope.Message = '';
    $scope.Color = '';
    $scope.ModalMessage = '';
    $scope.ModalMessageColor = '';
    $scope.displayLoading = false;
    $scope.displayLoadingModal = false;
    $scope.CurrencyCodes = [];
    $scope.ChangeCurrencyCode = false;
    $scope.realCurrencyCode = false;
    $scope.ExchangeRates = {
        Code: '',
        Rates: []
    };

    // Get available currency codes
    $scope.getCurrencyCodes = function()
    {
        $scope.Message = '';
        $scope.displayLoading = true;
        $scope.CurrencyCodes = [];
        $http( {
            url: '/currency-codes',
            method: 'GET'
        } ).then( function success( result )
        {
            $scope.displayLoading = false;
            if ( typeof result.data.data !== 'undefined' && result.data.data.length > 0 )
            {
                if ( angular.isArray( result.data.data ) )
                {
                    $scope.CurrencyCodes = result.data.data;
                }
            }
            else
            {
                $scope.Message = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
                $scope.Color = 'danger';
            }
        }, function error( error )
        {
            $scope.displayLoading = false;
            $scope.Message = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
            $scope.Color = 'danger';
        });
    };

    // Get historical data from currency code
    $scope.getHistoricalRates = function( currencyCode )
    {
        $scope.ModalMessage = '';
        $scope.ExchangeRates = {
            Code: '',
            Rates: []
        };
        if ( currencyCode !== "" )
        {
            $scope.displayLoadingModal = true;
            $http( {
                url: '/get-currency-code-rates',
                method: 'POST',
                data: { currencyCode: currencyCode }
            } ).then( function success( result )
            {
                $scope.displayLoadingModal = false;
                if ( typeof result.data.success !== 'undefined' && result.data.success === true )
                {
                    if ( angular.isArray( result.data.data ) && result.data.data.length > 0 )
                    {
                        $scope.ExchangeRates.Rates = result.data.data;
                        $scope.ExchangeRates.Code = currencyCode;
                    }
                    else
                    {
                        $scope.ModalMessage = 'Historical exchange rates to ' + currencyCode + ' not found';
                        $scope.ModalMessageColor = 'warning';
                    }
                }
                else
                {
                    $scope.ModalMessage = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
                    $scope.ModalMessageColor = 'danger';
                }
            }, function error( error )
            {
                $scope.displayLoadingModal = false;
                $scope.ModalMessage = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
                $scope.ModalMessageColor = 'danger';
            });
        }
    };

    // Clear check currency code if currency code change
    $scope.clearCheckCurrncyCode = function ()
    {
        $scope.realCurrencyCode = false;
        $scope.ExchangeRates.Rates = [];
    } 

    // Check ficticious currency codes
    $scope.checkCurrencyCodeExists = function()
    {
        if ( $scope.ExchangeRates.Code != "" )
        {
            $scope.ModalMessage = '';
            $scope.ExchangeRates.Rates = [];
            $scope.displayLoadingModal = true;
            $scope.realCurrencyCode = false;
            $http( {
                url: '/api/check-currency-code?currencyCode=' + $scope.ExchangeRates.Code,
                method: 'GET'
            } ).then( function success( result )
            {
                $scope.displayLoadingModal = false;
                if ( typeof result.data.success === 'undefined' || result.data.success === false )
                {
                    $scope.getHistoricalRates( $scope.ExchangeRates.Code );
                }
                else
                {
                    $scope.realCurrencyCode = true;
                    $scope.ModalMessage = 'Real exchange rates are available in external API, please click in save button';
                    $scope.ModalMessageColor = 'success';
                }
            }, function error( error )
            {
                $scope.displayLoadingModal = false;
                $scope.ModalMessage = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
                $scope.ModalMessageColor = 'danger';
            });
        }
        else
        {
            $scope.ModalMessage = 'Please inform currency code';
            $scope.ModalMessageColor = 'danger';
        }
    };

    // Save currency code and historical data if currency code is ficticious
    $scope.saveCurrencyCodeAndHistoricalRates = function()
    {
        $scope.ModalMessage = '';
        if ( $scope.realCurrencyCode === false && $scope.ExchangeRates.Rates.length <= 0 )
        {
            $scope.ModalMessage = 'Please click check currency code button';
            $scope.ModalMessageColor = 'danger';
            return false;
        }

        $scope.displayLoadingModal = true;
        $http( {
            url: '/save-currency-code',
            method: 'POST',
            data: JSON.stringify({ currencyCode: $scope.ExchangeRates })
        } ).then( function success( result )
        {
            $scope.displayLoadingModal = false;
            if ( typeof result.data.success !== 'undefined' && result.data.success === true )
            {
                if ( angular.isArray( result.data.data ) && result.data.data.length > 0 )
                {
                    $scope.ModalMessage = 'Currency code ' + $scope.ExchangeRates.Code + ' save';
                    $scope.ModalMessageColor = 'success';
                    setTimeout(function(){
                        $scope.cancelSaveCurrencyCode();
                        window.location.reload();
                    }, 2000);
                }
                else
                {
                    $scope.ModalMessage = 'Historical exchange rates to ' + currencyCode + ' not found';
                    $scope.ModalMessageColor = 'warning';
                }
            }
            else
            {
                $scope.ModalMessage = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
                $scope.ModalMessageColor = 'danger';
            }
        }, function error( error )
        {
            $scope.displayLoadingModal = false;
            $scope.ModalMessage = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
            $scope.ModalMessageColor = 'danger';
        });
    };

    // Delete currency code and historical exchange rate data
    $scope.deleteCurrencyCodeAndHistoricalRates = function()
    {
        currencyCode = $('.delete-currency').val();
        if ( currencyCode !== "" )
        {
            $scope.Message = '';
            $scope.displayLoading = true;
            $http( {
                url: '/api/delete-currency-code/' + currencyCode,
                method: 'DELETE'
            } ).then( function success( result )
            {
                $scope.displayLoading = false;
                if ( typeof result.data.success !== 'undefined' && result.data.success === true )
                {
                    $scope.Message = 'Currency code and historical exchange rate deleted';
                    $scope.Color = 'success';
                    $scope.cancelSaveCurrencyCode();
                    $('#removeConfirm').modal('hide');
                    setTimeout(function(){
                        window.location.reload();
                    }, 2000);
                }
                else
                {
                    $scope.Message = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
                    $scope.Color = 'danger';
                }
            }, function error( error )
            {
                $scope.displayLoading = false;
                $scope.Message = 'Sorry, an error occurred during your request. Please, try again later. If this error persists contact our technical support.';
                $scope.Color = 'danger';
            });
        }
    }

    // Populate data in form manage currency codes
    $scope.mountFormCurrencyRates = function()
    {
        currencyCode = $(this)[0].Code.code;
        $scope.ChangeCurrencyCode = false;
        $scope.ExchangeRates = {
            Code: '',
            Rates: []
        };

        if ( currencyCode !== '' )
        {
            $scope.ChangeCurrencyCode = true;
            $('.form-title').text( 'Edit exchange rates to ' + currencyCode );
            $scope.getHistoricalRates( currencyCode );
        }
        else
        {
            $('.form-title').text( 'Enter New Currency Code' );
        }
    };

    // Reset data in form manage currency codes
    $scope.cancelSaveCurrencyCode = function()
    {
        $scope.ExchangeRates = {
            Code: '',
            Rates: []
        };
        $scope.ChangeCurrencyCode = false;
        $('.form-title').text( 'Enter New Currency Code' );
    };

    $('#removeConfirm').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var currency = button.data('currency');
        var modal = $(this)
        modal.find('.modal-title').text('Remove currency code ' + currency);
        modal.find('.modal-body input').val(currency)
      });

    // Initialize manage currency code table
    $scope.getCurrencyCodes();
}]);