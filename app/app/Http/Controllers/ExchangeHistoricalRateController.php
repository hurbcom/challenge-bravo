<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\ExchangeHistoricalRate;
use App\Models\CurrencyCodes;
use App\DataObjects\CurrencyLocale;

use Throwable;

class ExchangeHistoricalRateController extends Controller
{
    /**
     * Available queries in request
     *
     * @var (array)
     * @access private
     */
    private $aMandatoryRequestQuery = [ 'from', 'to', 'amount' ];

    /**
     * Show exchange rate tools index
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view( 'exchange_rate_conversion.index' );
    }

    /**
     * Return object to format monetary values according currency code
     *
     * @param (string) sCurrency - Currency code
     *
     * @return (object)
     */
    private function getMonetaryFormat( $sCurrency )
    {
        $oCurrencyLocale = new CurrencyLocale();
        $aLocales = array_keys( $oCurrencyLocale->getCurrencyLocales(), $sCurrency );
        $oFmt = numfmt_create( 'en_US', \NumberFormatter::CURRENCY );
        if ( !empty( $aLocales ) )
        {
            $oFmt = numfmt_create( $aLocales[0], \NumberFormatter::CURRENCY );
        }

        return $oFmt;
    }

    /**
     * Get historical rates if error or off line external API
     *
     * @param (string) sFrom - Currency code base
     * @param (string) sTo - Specific currency code to verify
     * @param (string) sAmount - Amount consulted
     * @param (object) oFmt - Monetary object formatter
     * @param (array) mDiff (optional) - Currency codes to verify if have all selected
     *
     * @return (array)
     */
    public function find( $sFrom, $sTo, $sAmount )
    {
        $aResponse = [];
        try
        {
            // All available exchange rates from-to currency codes database
            if ( $sTo === 'ALL' )
            {
                $aCurrencyCodes = ExchangeHistoricalRate::where( 'code', "LIKE", "$sFrom-%" )->get();
                if ( !$aCurrencyCodes->isEmpty() )
                {
                    foreach( $aCurrencyCodes as $iKey => $aCurrencyCode )
                    {
                        // Get amount according historical rate
                        $sValue = ( $aCurrencyCode->rate * $sAmount );
                        $sTo = str_replace( "$sFrom-", "", $aCurrencyCode->code );
                        $oFmt = $this->getMonetaryFormat( $sTo );
                        $sRate = sprintf( "%.6f", $aCurrencyCode->rate );
                        $aResponse[] = [ 'code' => $aCurrencyCode->code, 'historical' => date( "d/m/Y", strtotime( $aCurrencyCode->historical ) ), 'amount' => numfmt_format_currency( $oFmt, $sValue, $sTo ), 'rate' => $sRate ];
                    }
                }
                else
                {
                    // Get exchange rates from external real API
                    $mExternalApiExchangeRates = file_get_contents( $this->sRealExternalApiUrl . $sFrom );
                    if ( $mExternalApiExchangeRates !== false )
                    {
                        $aData = json_decode( $mExternalApiExchangeRates, true );
                        if ( !empty( $aData['data'] ) )
                        {
                            // Get all currency codes except from
                            $aCurrencyCodes = CurrencyCodes::where( 'code', '<>', $sFrom )->get();
                            if ( !$aCurrencyCodes->isEmpty() )
                            {
                                $sHistoricalDate = date( "Y-m-d H:i:s", $aData['query']['timestamp'] );
                                foreach( $aCurrencyCodes as $aCurrencyCode )
                                {
                                    // Check currency code to exists in database
                                    if ( array_key_exists( $aCurrencyCode->code, $aData['data'] ) )
                                    {
                                        $oFmt = $this->getMonetaryFormat( $aData['data'][$aCurrencyCode->code] );
                                        // Save historical exchange rates
                                        $aResponse[] = $this->store( $sFrom, $aCurrencyCode->code, $sAmount, $oFmt, $aData['data'][$aCurrencyCode->code], $sHistoricalDate );
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                $aHistorical = ExchangeHistoricalRate::where( 'code', "$sFrom-$sTo" )->first();
                if ( !empty( $aHistorical ) )
                {
                    // Get amount according historical rate
                    $sValue = ( $aHistorical['rate'] * $sAmount );
                    $sRate = sprintf( "%.6f", $aHistorical['rate'] );
                    $oFmt = $this->getMonetaryFormat( $sTo  );
                    $aResponse[] = [ 'code' => "$sFrom-$sTo", 'historical' => date( "d/m/Y", strtotime( $aHistorical['historical'] ) ), 'amount' => numfmt_format_currency( $oFmt, $sValue, $sTo ), 'rate' => $sRate ];
                }
                else
                {
                    // Get exchange rates from external real API
                    $mExternalApiExchangeRates = file_get_contents( $this->sRealExternalApiUrl . $sFrom );
                    if ( $mExternalApiExchangeRates !== false )
                    {
                        $aData = json_decode( $mExternalApiExchangeRates, true );
                        if ( !empty( $aData['data'] ) )
                        {
                            $sHistoricalDate = date( "Y-m-d H:i:s", $aData['query']['timestamp'] );
                            // Check currency code to exists in database
                            if ( array_key_exists( $sTo, $aData['data'] ) )
                            {
                                $oFmt = $this->getMonetaryFormat( $sTo );
                                // Save historical exchange rates
                                $aResponse[] = $this->store( $sFrom, $sTo, $sAmount, $oFmt, $aData['data'][$sTo], $sHistoricalDate );
                            }
                        }
                    }
                }
            }
        }
        catch ( Throwable $e )
        {
            report( $e );
            /*
             * TO DO
             *
             * In case of exception save logs in database if you wish
             */
        }

        return $aResponse;
    }

    /**
     * Save historical requests to use in case external API off line
     *
     * @param (string) sFrom - Currency code base
     * @param (string) sTo - Specific currency code to verify
     * @param (string) sAmount - Amount consulted
     * @param (object) oFmt - Monetary object formatter
     * @param (string) sExchangeRate - Exchange rate
     * @param (string) sHistoricalDate - Historical date to exchange rate
     *
     * @return (array)
     */
    public function store( $sFrom, $sTo, $sAmount, \NumberFormatter $oFmt, $sExchangeRate, $sHistoricalDate )
    {
        $aResponse = [];
        try
        {
            $sFrom = strtoupper( $sFrom );
            $sTo = strtoupper( $sTo );
            // Check historical data exists in database
            $aHistorical = ExchangeHistoricalRate::where( 'code', "$sFrom-$sTo" )->first();
            if ( !empty( $aHistorical ) )
            {
                ExchangeHistoricalRate::where( 'code', "$sFrom-$sTo" )->update( [ 'rate' => $sExchangeRate, 'historical' => $sHistoricalDate ] );
            }
            else
            {
                ExchangeHistoricalRate::create( [ 'code' => "$sFrom-$sTo", 'rate' => $sExchangeRate, 'historical' => $sHistoricalDate ] );
            }
            // Return converted exchange rate
            $sRate = sprintf( "%.6f", $sExchangeRate );
            $sValue = $sAmount * $sExchangeRate;
            $aResponse = [ 'code' => "$sFrom-$sTo", 'historical' => date( "d/m/Y", strtotime( $sHistoricalDate ) ), 'amount' => numfmt_format_currency( $oFmt, $sValue, $sTo ), 'rate' => $sRate ];
        }
        catch ( Throwable $e )
        {
            report( $e );
            /*
             * TO DO
             *
             * In case of exception save logs in database if you wish
             */
        }

        return $aResponse;
    }

    /**
     * Get exchange rate values
     *
     * @param (object) Request oRequest - Object request
     *
     * @return (string)
     */
    public function exchangeRateValues( Request $oRequest )
    {
        $aResponse = [ 'data' => [], 'success' => false ];
        // Check mandatory values in request query
        if ( $oRequest->has( $this->aMandatoryRequestQuery ) )
        {
            // Define default variables
            $aResult = [];
            $sTo = strtoupper( $oRequest->input( 'to' ) );
            $sFrom = strtoupper( $oRequest->input( 'from' ) );
            $sAmount = ( !empty( $oRequest->input( 'amount' ) ) ) ? $oRequest->input( 'amount' ) : 1;

            try
            {
                // Send request to internal API
                $mGetContent = file_get_contents( $this->sGolangApi . "/exchange-rate?" . "from=$sFrom&to=$sTo&amount=$sAmount" );
                if ( $mGetContent !== false )
                {
                    // If golang API return converted exchange rate
                    $aApiResult = json_decode( $mGetContent, true );
                    if ( !empty( $aApiResult['data'] ) )
                    {
                        if ( $sTo === 'ALL' )
                        {
                            foreach( $aApiResult['data'] as $iKey => $aExchangeRate )
                            {
                                $sRate = sprintf( "%.6f", $aExchangeRate['rate'] );
                                $sValue = str_replace (',', '.', str_replace ('.', '', $aExchangeRate['amount']));
                                $sTo = str_replace( "$sFrom-", "", $aExchangeRate['code'] );
                                $oFmt = $this->getMonetaryFormat( $sTo );
                                $aResult[] = [ 'code' => "{$aExchangeRate['code']}", 'historical' => $aExchangeRate['historical'], 'amount' => numfmt_format_currency( $oFmt, $sValue, $sTo), 'rate' => $sRate ];
                            }
                        }
                        else
                        {
                            $sRate = sprintf( "%.6f", $aApiResult['data'][0]['rate'] );
                            $sValue = str_replace (',', '.', str_replace ('.', '', $aApiResult['data'][0]['amount']));
                            $oFmt = $this->getMonetaryFormat( $sTo );
                            $aResult[] = [ 'code' => "{$aApiResult['data'][0]['code']}", 'historical' => $aApiResult['data'][0]['historical'], 'amount' => numfmt_format_currency( $oFmt, $sValue, $sTo ), 'rate' => $sRate ];
                        }
                    }
                }
            }
            catch ( Throwable $e )
            {
                report( $e );
                /*
                 * TO DO
                 *
                 * In case of exception save logs in database if you wish
                 */
            }

            if ( empty( $aResult ) )
            {
                // Try get exchange rate to MySQL or external API
                $aResult = $this->find( $sFrom, $sTo, $sAmount );
            }

            // Return response in json if exists
            if ( !empty( $aResult ) )
            {
                $aResponse = [ 'data' => $aResult, 'success' => true ];
            }
        }

        return response()->json( $aResponse );
    }

    /**
     * Get exchange rates by currency code
     * 
     * @return (string)
     */
    public function getExchangeRatesByCurrencyCode( Request $oRequest )
    {
        $aResponse = ['data' => [], 'success' => false ];
        if ( $oRequest->isMethod( 'post' ) )
        {
            if ( $oRequest->has( 'currencyCode' ) )
            {
                $aRates = [];
                $sCurrencyCode = strtoupper( $oRequest->input( 'currencyCode' ) );
                // Get all codes except selected
                $aCurrencyCodes = CurrencyCodes::where( 'code', "<>", "$sCurrencyCode" )->get();
                if ( !$aCurrencyCodes->isEmpty() )
                {
                    foreach( $aCurrencyCodes as $iKey => $aCurrencyCode )
                    {
                        $aHistorical = ExchangeHistoricalRate::where( 'code', "$sCurrencyCode-$aCurrencyCode->code" )->first();
                        if ( !empty( $aHistorical ) )
                        {
                            $sRate = sprintf( "%.6f", $aHistorical->rate );
                            $aRates[] = [ 'code' => $aCurrencyCode->code, 'rate' => $sRate, 'created' => $aHistorical->created_at ];
                            continue;
                        }
                        $aRates[] = [ 'code' => $aCurrencyCode->code, 'rate' => "", 'created' => $aCurrencyCode->created_at ];
                    }
                }

                $aResponse = ['data' => $aRates, 'success' => true ];
            }
        }

        return response()->json( $aResponse );
    }
}