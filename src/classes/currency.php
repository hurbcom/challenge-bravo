<?php

class currencyClass {

    public function getRegularRates(&$rates) {
        // this function takes the values of the normal currencies based on the dollar
        $rate_usd = file_get_contents('https://api.exchangeratesapi.io/latest?base=USD');
        
        // if API is out it will try another
        if (empty($rate_usd)) {
            $rate_usd = file_get_contents('http://api.openrates.io/latest?base=USD');
        }

        $json_usd = json_decode($rate_usd);
        $rates['EUR'] = round($json_usd->rates->EUR,6); // euro
        $rates['BRL'] = round($json_usd->rates->BRL,6); // brazilian real
    }

    public function getCryptoRates($from,$to,&$rates) {
        // this function takes the values of the crypto-currencies based on the dollar
        // to avoid calling the API twice, let's check if some crypto-currency is dropped as a parameter
        if ($from == 'btc' || $to == 'btc') { 
            $rate_btc = file_get_contents('https://poloniex.com/public?command=returnTicker');
            // if API is out it will try another
            if (empty($rate_btc)) {
                $rate_btc = file_get_contents('https://api.cryptonator.com/api/ticker/usd-btc');
                $json_btc = json_decode($rate_btc);
                $rates['BTC'] = round($json_btc->ticker->price,6); // bitcoin
            } else {
                $json_btc = json_decode($rate_btc);
                $rates['BTC'] = round(1/$json_btc->USDT_BTC->last,6); // bitcoin
            }
        }
        
        if ($from == 'eth' || $to == 'eth') {
            $rate_eth = file_get_contents('https://poloniex.com/public?command=returnTicker');
            // if API is out it will try another
            if (empty($rate_eth)) {
                $rate_eth = file_get_contents('https://api.cryptonator.com/api/ticker/usd-eth');
                $json_eth = json_decode($rate_eth);
                $rates['ETH'] = round($json_eth->ticker->price,6); // ethereum
            } else {
                $json_eth = json_decode($rate_eth);
                $rates['ETH'] = round(1/$json_eth->USDT_ETH->last,6); // ethereum
            }
        }
    }

    public function getCurrencySymbol($currency) {
        switch ($currency) {
            case 'brl':
                $symbol = 'R&#36;'; // brazilian real
                break;
            case 'eur':
                $symbol = '&#128;'; // euro
                break;
            case 'btc':
                $symbol = 'BTC'; // bitcoin
                break;
            case 'eth':
                $symbol = 'ETH'; // ethereum
                break;
            case 'usd':
                $symbol = '&#36;'; // dollar
                break;
        }

        return $symbol;
    }

    public function getCurrencyRate($currency,$rates,$amount) {
        switch ($currency) {
            case 'brl':
                $rate = $amount*$rates['BRL']; // brazilian real
                break;
            case 'eur':
                $rate = $amount*$rates['EUR']; // euro
                break;
            case 'btc':
                $rate = $amount*$rates['BTC']; // bitcoin
                break;
            case 'eth':
                $rate = $amount*$rates['ETH']; // ethereum
                break;
            case 'usd':
                $rate = $amount*$rates['USD']; // dollar
                break;
        }

        return $rate;
    }
}

?>