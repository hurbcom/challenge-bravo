<?php

declare(strict_types=1);

namespace App\HttpClient;

class CurlHttpClient implements HttpClientsInterface
{
    public function startHttpClient(string $url, string $method, string $json = null): array
    {
        //Inicia cUrl
        $curl = curl_init();

        //Headers
        $headers = [];

        $params = [
            CURLOPT_URL             => $url,
            CURLOPT_CUSTOMREQUEST   => $method,
            CURLOPT_RETURNTRANSFER  => true,
            CURLOPT_HTTPHEADER      => $headers,
        ];

        if ($json) {
            $params[] = ["CURLOPT_POSTFIELDS" => $json];
        }
        curl_setopt_array($curl, $params);

        $response = curl_exec($curl);

        if (curl_errno($curl)) {
            $error_msg = curl_error($curl);
            throw new \Exception($error_msg);
        }

        curl_close($curl);

        $arrayResponse = json_decode($response, true);

        return isset($arrayResponse) ? $arrayResponse : ['error' => 'Error to convert.'];
    }
}
