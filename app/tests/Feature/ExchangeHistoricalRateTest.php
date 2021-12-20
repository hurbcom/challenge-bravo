<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\ExchangeHistoricalRate;
use App\Models\CurrencyCodes;

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
     * Render view test
     * 
     * @test
     * 
     * @return void
     */
    public function get_render_index_view()
    {
        $response = $this->get( '/' );
        $response->assertHeader("Content-Type", "text/html; charset=UTF-8")
        ->assertStatus( 200 )
        ->assertViewIs("exchange_rate_conversion.index");

        $response = $this->post( '/' );
        $response->assertStatus( 405 );
    }

    /**
     * Test get rates by currency code
     * 
     * @test
     * 
     * @return void
     */
    public function get_historical_exchange_rates_by_currency_code()
    {
        $response = $this->get( '/get-currency-code-rates' );
        $response->assertStatus( 405 );

        $response = $this->post( '/get-currency-code-rates' );
        $response->assertStatus( 200 )
        ->assertJsonPath("success", false);

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

                $response = $this->post( '/get-currency-code-rates', ['currencyCode' => $aCurrencyCodes[$i]->code] );
                $response->assertStatus( 200 )
                ->assertJsonPath("success", true);
            }
        }
    }
}
