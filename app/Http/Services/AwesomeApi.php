<?php

namespace App\Http\Services;
use App\Enums\CurrencyEnum;
use App\Models\Currency;
use Exception;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class AwesomeApi
{
    /**
     * Get Last Currency Price.
     * @param String $to
     *
     * @return array
     * @throws Exception
     */
    public function getLastExchange(String $to): array
    {
        $from = CurrencyEnum::BACKING_CURRENCY;

        $response = $this->getAwesomeApi("/last/{$to}-{$from}");

        $responseArr = [];

        if(!$response->failed()){
            $responseArr = $response->json();
            $responseArr = array_shift($responseArr);
            $responseArr = $this->fixAwesomeApiFloatingDot($responseArr);
        }

        return Currency::mapAwesomeApiToCurrency($responseArr);
    }

    /**
     * Fix AwesomeApi Formatting.
     * This is due to an API issue. Punctually, I'm just resolving BTC and ETH.
     * Maybe there are others currencies with the same error.
     * Ref: https://github.com/raniellyferreira/economy-api/issues/23
     *
     * @return array
     * @throws Exception
     */
    private function fixAwesomeApiFloatingDot($responseArr): array{
        if(isset($responseArr['code'])
            && in_array($responseArr['code'], ['BTC', 'ETH'])){
            $responseArr['bid'] = $responseArr['bid'] * 1000;
        }

        return $responseArr;
    }

    /**
     * Available Currencies.
     *
     * @return array
     * @throws Exception
     */
    public function availableCurrencies(): array
    {
        $response = $this->getAwesomeApi('/available');

        if($response->failed()){
            throw new Exception('AwesomeApi: Unable to load available Currencies.', 404);
        }

        $availableCurrencies = Array();
        $filterBy = '-'.CurrencyEnum::BACKING_CURRENCY;

        foreach($response->object() as $codes => $name){
            if (preg_match("/$filterBy/i", $codes)) {
                $availableCurrencies[] = str_replace($filterBy, '', $codes);
            }
        }

        return $availableCurrencies;
    }

    /**
     * Method Get AwesomeApi.
     * @param String $queryString
     *
     * @return Response
     */
    private function getAwesomeApi(String $queryString): Response
    {
        return Http::get('https://economia.awesomeapi.com.br/json' . $queryString);
    }

}
