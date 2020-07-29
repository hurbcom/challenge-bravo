<?php

declare(strict_types=1);

namespace App\Service;

use GuzzleHttp\Client;

use function floatval;
use function json_decode;
use function sprintf;

use const JSON_PRESERVE_ZERO_FRACTION;

class ExternalApiService
{
    private string $url;
    private ?string $password;

    public function __construct(string $url, ?string $password = null)
    {
        $this->url      = $url;
        $this->password = $password;
    }

    public function fetchUpdatedCurrency(string $from, string $to): ?float
    {
        $client  = new Client(['base_uri' => $this->url]);
        $headers = [];
        if (! empty($this->password)) {
            $headers[] = [
                'Authorization' => 'Apikey ' . $this->password,
            ];
        }

        $request = $client->request(
            'GET',
            sprintf('/data/price?fsym=%s&tsyms=%s', $from, $to),
            ['headers' => $headers]
        );

        if ($request->getStatusCode() !== 200) {
            return 0.0;
        }

        $response = json_decode($request->getBody()->getContents(), true, 512, JSON_PRESERVE_ZERO_FRACTION);

        return floatval($response[$to] ?? 0.0);
    }
}
