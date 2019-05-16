<?php

namespace Hurb\CurrencyConverter\Providers;

use GuzzleHttp\ClientInterface as Client;
use Hurb\CurrencyConverter\CurrencyConverterException;

final class CryptoCompareRateProvider implements ProviderInterface
{
    /**
     * @var string
     */
    private const METHOD = 'GET';

    /**
     * @var string
     */
    private const URI = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USD,BRL,BTC,ETH,EUR';

    /**
     * @var string
     */
    private const API_KEY = '3c87688c9f6110fac9031b61e6ae16ccf61f8ed6f2b0a361ab7a7cb74ee6721b';

    /**
     * @var Client
     */
    private $client;

    /**
     * @param Client $client
     * @return void
     */
    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * Retrieve Currencies to be used in the conversion from an external service.
     *
     * @return iterable
     */
    public function retrieve() : iterable
    {
        try {
            $response = $this->client->request(
                self::METHOD,
                sprintf("%s&%s", self::URI, self::API_KEY)
            );
        } catch (\Exception $ex) {
            throw new CurrencyConverterException(1);
        }

        $data = json_decode($response->getBody(), true);

        if (! is_iterable($data)) {
            throw new CurrencyConverterException(2);
        }

        return $data;
    }
}
