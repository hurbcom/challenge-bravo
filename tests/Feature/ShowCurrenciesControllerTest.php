<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class ShowCurrenciesControllerTest extends TestCase
{
    private $uri;

    public function setUp(): void
    {
        parent::setUp();
        $this->uri = 'api/currency/show';
    }

    public function testShouldInsertReturnSuccess()
    {
        $response = $this->get($this->uri);

        $response->assertJson(
            fn (AssertableJson $json) =>
            $json->has('data')
            ->where('data.status', 'success')
        );
    }
}
