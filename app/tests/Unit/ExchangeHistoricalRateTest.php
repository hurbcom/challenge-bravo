<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\ExchangeHistoricalRate;
use App\Models\CurrencyCodes;
use App\Http\Controllers\ExchangeHistoricalRateController;

class ExchangeHistoricalRateTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Indicates whether the default seeder should run before each test.
     *
     * @var bool
     */
    protected $seed = true;

    /**
     * Check historical exchange rates save to currency code
     * 
     * @test
     */
    public function check_historical_exchange_rates_by_currency_code()
    {
        $oExchangeRateController = new ExchangeHistoricalRateController();
        $oCurrencyCodes = CurrencyCodes::factory()->make();
        if ( !empty( $oCurrencyCodes ) )
        {
            $aCurrencyCodes = $oCurrencyCodes->get( "code" );
            for ( $i = 0; $i < count( $aCurrencyCodes ); $i++ )
            {
                foreach( $aCurrencyCodes as $iKey => $oCurrencyCode )
                {
                    if ( $aCurrencyCodes[$i]->code != $oCurrencyCode->code )
                    {
                        $sCurrencyCode = "{$aCurrencyCodes[$i]->code}-{$oCurrencyCode->code}";
                        ExchangeHistoricalRate::factory()->create(['code' => $sCurrencyCode]);
                    }
                }

                // Check all data save
                $oExchangeHistoricalRates = ExchangeHistoricalRate::where( 'code', "LIKE", "{$aCurrencyCodes[$i]->code}-%" )->get();
                $aData = $oExchangeRateController->find( $aCurrencyCodes[$i]->code, "ALL", "2.00" );
                $this->assertCount( count( $aData ), $oExchangeHistoricalRates );

                // Check no data found
                $aData = $oExchangeRateController->find( $aCurrencyCodes[$i]->code, "WWW", "2.00" );
                $this->assertEmpty( $aData );

                // Check same code not save
                $aData = $oExchangeRateController->find( $aCurrencyCodes[$i]->code, $aCurrencyCodes[$i]->code, "2.00" );
                $this->assertEmpty( $aData );

                // Check zero value not save
                $aData = $oExchangeRateController->find( $aCurrencyCodes[$i]->code, "ALL", "0.00" );
                $this->assertEmpty( $aData );
            }
        }
    }
}
