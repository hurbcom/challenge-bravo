<?php

namespace App\Client;

class APIClient
{
    public function json($url = "", $headers = [])
    {
        try {
            $client = new \GuzzleHttp\Client();
            $response = $client->request('GET', $url);

            return json_decode($response->getBody()->getContents());
        }catch(\Exception $e){
            return json_encode(['status' => 0, 'message' => 'Erro na API']);
        }
    }
}