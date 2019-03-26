<?php
namespace App\Library\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class MoneyApi {

    protected $urlApi;
    protected $tokenApi;
    protected $httpClient;

    public function __construct()
    {
        $this->urlApi = env('API_URL');
        $this->tokenApi = env('API_TOKEN');
        $this->httpClient = new Client();
    }

    public function getService($url_path, $method = 'GET', $params = [], $assoc = false, $debug = false) {
        $params = [
            'headers' => [
            ],
            'form_params' => $params
        ];

        $api_key = '&api_key='.$this->tokenApi;

        try{
            $request_api = $this->httpClient->request($method, $this->urlApi . $url_path . $api_key, $params);
            $body = json_decode($request_api->getBody()->getContents(true), $assoc);
        } catch (RequestException $e){
            $body = json_decode($e->getResponse()->getBody()->getContents(true));
        }

        if($debug){
            print_r($body);
        }

        return $body;
    }
}
