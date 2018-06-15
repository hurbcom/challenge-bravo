<?php

abstract class TestCase extends Laravel\Lumen\Testing\TestCase
{
    public function createApplication()
    {
        return require __DIR__.'/../bootstrap/app.php';
    }
}
