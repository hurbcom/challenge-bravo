<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class InsertCurrencyControllerTest extends TestCase
{
    // use RefreshDatabase;

    private $inputData;

    public function setUp(): void
    {
        parent::setUp();
        $this->inputData = ['indentificationName' => 'FKE'];
    }

    public function testShouldInsertReturnSuccess()
    {
        $response = $this->post('api/currency/create', $this->inputData);

        $response->assertJson(
            fn (AssertableJson $json) =>
            $json->has('data')
            ->where('data.status', 'success')
        );
    }
}
