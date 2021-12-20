<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\CurrencyCodes;

class CurrencyCodeTest extends TestCase
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
    public function get_render_manage_currency_code_view()
    {
        $response = $this->get( '/manage-currency-codes' );
        $response->assertHeader("Content-Type", "text/html; charset=UTF-8")
        ->assertStatus( 200 )
        ->assertViewIs("currency_codes.manage");

        $response = $this->post( '/manage-currency-codes' );
        $response->assertStatus( 405 );
    }

    /** 
     * Test get list currency codes
     * 
     * @test 
     * 
     * @return void
     */
    public function get_currency_code_list()
    {
        CurrencyCodes::factory()->make();
        $response = $this->get( '/currency-code-list' );
        $response->assertHeader("Content-Type", "application/json")
        ->assertStatus( 200 )
        ->assertValid(['success', 'data']);

        $response = $this->post( '/currency-code-list' );
        $response->assertStatus( 405 );
    }

    /** 
     * Test get currency codes
     * 
     * @test
     * 
     * @return void
     */
    public function get_all_currency_codes()
    {
        CurrencyCodes::factory()->make();
        $response = $this->get( '/currency-codes' );
        $response->assertHeader("Content-Type", "application/json")
        ->assertStatus( 200 )
        ->assertValid(['success', 'data']);

        $response = $this->post( '/currency-codes' );
        $response->assertStatus( 405 );
    }

    /** 
     * Test check real currency code
     * 
     * @test
     * 
     * @return void
     */
    public function check_real_currency_code()
    {
        $oCurrencyCodes = CurrencyCodes::factory()->make();
        $response = $this->get( '/api/check-currency-code' );
        $response->assertHeader("Content-Type", "application/json")
        ->assertStatus( 200 )->assertValid(['success', 'data'])
        ->assertJsonPath("success", false);

        $response = $this->post( '/api/check-currency-code' );
        $response->assertStatus( 405 );

        $aCurrencyCodes = $oCurrencyCodes->get( "code" );
        $response = $this->get( "/api/check-currency-code?currencyCode={$aCurrencyCodes[0]->code}" );
        $response->assertHeader("Content-Type", "application/json")
        ->assertStatus( 200 )->assertValid(['success', 'data'])
        ->assertJsonPath("data", []);
    }
}
