<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class DeleteCurrencyControllerTest extends TestCase
{
    private $inputData;

    public function setUp(): void
    {
        parent::setUp();
        $this->inputData = 'FKE';
    }

    public function testShouldInsertReturnSuccess()
    {
        $response = $this->delete('api/currency/delete/' . $this->inputData);

        $response->assertJson(
            fn (AssertableJson $json) =>
            $json->has('data')
            ->where('data.status', 'success')
        );
    }
}
