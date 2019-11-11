<?php

namespace tests\Functional;

use TestCase;

class WelcomeTest extends TestCase
{
    public function testWelcomeSuccess()
    {
        $response = $this->get(route('welcome'));
        $response->assertResponseOk();
        $response->seeJson([
            'framework' => 'Lumen (6.2.0) (Laravel Components ^6.0)',
            'app' => 'Hurb Challenge Bravo'
        ]);
    }
}