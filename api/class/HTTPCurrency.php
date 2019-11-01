<?php

/**
 * HTTPCurrency Class
 *
 * Makes request to external API in order to get rates 
 * 
 *
 */
class HTTPCurrency {

    /** @var string Endpoint for crypto currencies */
    const CRYPTO_END_POINT = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=";

    /** @var string Endpoint for regular currencies */
    const NON_CRYPTO_END_POINT = "http://www.floatrates.com/daily/usd.json";

    /**
     * Makes a request.
     *
     * @param	int $is_crypto 1 cryptocurrency / 0 regular.
     * @param	string $name Currency name.
     * @return	mixed.
     */
    function makeRequest($isCrypto, $name = NULL)
    {

        if ($isCrypto)
        {
            $url = self::CRYPTO_END_POINT . strtolower($name);
        }
        else
        {
            $url = self::NON_CRYPTO_END_POINT;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);

        return json_decode($output, true);
    }

}
