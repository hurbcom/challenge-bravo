<?php
namespace App\Client;

use Log;

class HurbClient extends AbstractClient
{

    protected function getUrl(): string
    {
        return env('_API_', 'https://economia.awesomeapi.com.br/');
    }

    protected function getToken(): string
    {
        return "";
    }

    public function getCurrency($code)
    {
        $url = $this->getUrl();
        return $this->query($url . 'all/' . $code);
    }
}
