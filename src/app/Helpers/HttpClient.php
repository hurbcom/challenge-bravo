<?php

namespace App\Helpers;

interface HttpClient
{
    public function getBodyOf(string $url): string;
}