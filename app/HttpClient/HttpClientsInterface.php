<?php

namespace App\HttpClient;

interface HttpClientsInterface
{
    public function startHttpClient(string $url, string $method, string $json = null) : array;
}
