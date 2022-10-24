<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class ConverterControllerTest extends TestCase
{
    private $inputData;
    private $uri;

    public function setUp(): void
    {
        parent::setUp();
        $this->inputData = 'currencyFrom=BRL&currencyTo=EUR&amount=100';
        $this->uri = 'api/currency/conversion?';
    }

    public function testShouldInsertReturnSuccess()
    {
        $response = $this->get($this->uri . $this->inputData);

        $response->assertJson(
            fn (AssertableJson $json) =>
            $json->has('data')
            ->where('data.status', 'success')
        );
    }
}
