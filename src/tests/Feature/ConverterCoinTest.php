<?php

namespace Tests\Feature;

use App\ConverterCoin;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ConverterCoinTest extends TestCase
{
    public function testIndex()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function testNoParams()
    {
        $response = $this->get('/api/converter');
        $response->assertStatus(422);
    }

    public function testWithParams()
    {
        $response = $this->get('/api/converter?from=BTC&to=BRL&amount=1');
        $response->assertStatus(200);
        $this->removeCache();
    }

    public function testWithNoAmountParams()
    {
        $response = $this->get('/api/converter?from=BTC&to=BRL');
        $response->assertStatus(422);
    }

    public function testWithNoToParams()
    {
        $response = $this->get('/api/converter?from=BTC&amount=1');
        $response->assertStatus(422);
    }

    public function testWithNoFromParams()
    {
        $response = $this->get('/api/converter?to=BRL&amount=1');
        $response->assertStatus(422);
    }

    public function removeCache()
    {
        $model = new ConverterCoin();
        return $model->removeCache();
    }
}
