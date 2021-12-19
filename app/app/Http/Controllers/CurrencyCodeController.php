<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\CurrencyCodes;
use Illuminate\Support\Facades\Http;

use Throwable;

class CurrencyCodeController extends Controller
{
    /**
     * Show manage currency codes
     * 
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function manageCurrencyCodes()
    {
        return view( 'currency_codes.manage' );
    }

    /**
     * Get list currency codes in database
     *
     * @return (string)
     */
    public function getListCurrencyCodes()
    {
        $aAvailableCurrencyCodes = [];
        // Get all currency codes to mount html select
        foreach ( CurrencyCodes::all() as $aCodes )
        {
            $aAvailableCurrencyCodes[] = ['name' => $aCodes->code, 'value' => $aCodes->code];
        }

        // Merge option all in result
        if ( !empty( $aAvailableCurrencyCodes ) )
        {
            $aAvailableCurrencyCodes = array_merge( [ ['name' => 'All', 'value' => 'all'] ], $aAvailableCurrencyCodes );
        }
        sort( $aAvailableCurrencyCodes );


        return response()->json( [ 'data' => $aAvailableCurrencyCodes, 'success' => true ] );
    }

    /**
     * Get all currency codes
     * 
     * @return (string)
     */
    public function getCurrencyCodes()
    {
        $aCurrencyCodes = [];
        // Get all currency codes to mount manage page
        foreach ( CurrencyCodes::all() as $aCodes )
        {
            $aCurrencyCodes[] = ['id' => $aCodes->idrate, 'code' => $aCodes->code, 'created' => date( "d/m/Y H:i:s", strtotime( $aCodes->created_at ) ), 'updated' => ( !empty( $aCodes->updated_at ) ) ? date( "d/m/Y H:i:s", strtotime( $aCodes->updated_at ) ) : '-', 'default' => $aCodes->default];
        }
        sort( $aCurrencyCodes );

        return response()->json( [ 'data' => $aCurrencyCodes, 'success' => true ] );
    }

    /**
     * Check if currency code is real
     * 
     * @return (string)
     */
    public function checkRealCurrencyCode( Request $oRequest )
    {
        $aRespose = ['data' => [], 'success' => false ];
        if ( $oRequest->has( 'currencyCode' ) )
        {
            $sCurrencyCode = $oRequest->input( 'currencyCode' );
            // Get exchange rates from external real API
            $mExternalApiExchangeRates = file_get_contents( $this->sRealExternalApiUrl . $sCurrencyCode );
            if ( $mExternalApiExchangeRates !== false )
            {
                $aData = json_decode( $mExternalApiExchangeRates, true );
                if ( !empty( $aData['data'] ) )
                {
                    $aRespose = [ 'data' => [], 'success' => !empty( $aData['data'][$sCurrencyCode] ) ];
                }
            }
        }

        return response()->json( $aRespose );
    }

    /**
     * Send data to internal API to save
     * 
     * @return (string)
     */
    public function saveCurrencyCode( Request $oRequest )
    {
        $aRespose = ['data' => [], 'success' => false ];
        if ( $oRequest->isMethod( 'post' ) )
        {
            $aDataRequest = $oRequest->all();
            if ( !empty( $aDataRequest['currencyCode'] ) )
            {
                $oResponse = Http::post( $this->sGolangApi . "/currency-codes", [
                    'Code' => strtoupper( $aDataRequest['currencyCode']['Code'] ),
                    'Rates' => $aDataRequest['currencyCode']['Rates']
                ]);

                $aRespose = $oResponse->json();
            }
        }

        return response()->json( $aRespose );
    }

    /**
     * Send data to internal API to delete
     * 
     * @return (string)
     */
    public function deleteCurrencyCode( Request $oRequest, $sCode )
    {
        $aRespose = ['data' => [], 'success' => false ];
        if ( $oRequest->isMethod( 'delete' ) )
        {
            if ( !empty( $sCode ) )
            {
                $sCode = strtoupper( $sCode );
                $oResponse = Http::delete( $this->sGolangApi . "/currency-codes/$sCode" );
                $aRespose = $oResponse->json();
            }
        }

        return response()->json( $aRespose );
    }
}