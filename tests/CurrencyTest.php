<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CurrencyTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testShouldReturnValue()
    {
        $getRequest = $this->get('http://cbravo.local/api/convert?from=BRL&to=EUR&amount=100.00');
        $response = $getRequest->seeStatusCode(200)->response->getContent();
        $json = json_decode($response);
        $getRequest
            ->seeJson([
                'value' => $json->value
            ]);
    }
}
