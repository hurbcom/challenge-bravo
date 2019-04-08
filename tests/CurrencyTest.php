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


        $this
            ->json('GET', '/api/convert', ['from' => 'BRL','to' => 'EUR','amount' => '100.00'])
            ->assertResponseStatus(200);

    }
}
