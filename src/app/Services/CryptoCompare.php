<?php

namespace App\Services;

use App\Http\Resources\ApiResource;

class CryptoCompare
{
    protected $url = 'https://min-api.cryptocompare.com/data/';
    protected $client;
    protected $response;
    protected $amount = 0;
    protected $params = [];
    private $originalResquest;

    public function __construct()
    {
        $this->client = new \GuzzleHttp\Client([
            'base_uri' => $this->url,
            'headers' => [
                'Authorization' => 'Apikey ' . env('API_KEY_CRYPTO')
            ]
        ]);
    }


    public function getResponse()
    {
        return $this->response;
    }

    public function request($route)
    {
        $request = $this->client->get($route, ['query' => $this->params]);
        $this->originalResquest = $request;
        return $this;
    }

    function params($params)
    {
        if (is_array($params)) {
            foreach ($params as $key => $param) {
                $data[$key] = strtoupper($param);
            }
        }

        $this->params = $data;
        return $this;
    }

    function amount($value)
    {
        $this->amount = (int) $value;
        return $this;
    }

    public function response()
    {
        $response = json_decode($this->originalResquest->getBody()->getContents(), true);

        if (isset($response['Response']) and $response['Response'] == 'Error') {
            $response = response()->json([
                'data' => [],
                'meta' => [
                    'message' => $response['Message'],
                    'errors' => [
                        $this->typeParams($response['ParamWithError']) => $response['Message']
                    ]
                ]
            ], 422, ['Content-Type' => 'application/json']);


            return $response->getContent();
        }

        //Criando valor
        $response['amount'] = $this->amount * array_values($response)[0];

        $response = response()->json([
            'data' => [
                'value' => $response['amount']
            ],
            'meta' => [
                'message' => 'success',
                'errors' => []
            ]
        ], 200, ['Content-Type' => 'application/json']);


        return $response->getContent();
    }

    public function typeParams($value)
    {
        switch ($value) {
            case 'fsym':
                return 'FROM';
                break;

            case 'tsyms':
                return 'TO';
                break;

            default:
                return $value;
                break;
        }
    }
}
