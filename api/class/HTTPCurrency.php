<?php

class HTTPCurrency {

    const CRYPTO_END_POINT = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=";
    const NON_CRYPTO_END_POINT = "http://www.floatrates.com/daily/usd.json";


    function makeRequest($isCrypto, $name = NULL)
    {

        if ($isCrypto)
        {
            $url = self::CRYPTO_END_POINT. strtolower($name);
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
