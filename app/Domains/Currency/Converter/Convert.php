<?php
/**
 * Created by PhpStorm.
 * User: j
 * Date: 27/03/19
 * Time: 16:12
 */


namespace App\Domains\Currency\Converter;


use Symfony\Component\HttpFoundation\JsonResponse;
use Illuminate\Support\Facades\Cache;




class Convert {
    /**
     * @return JsonResponse
     */
    public function run($request) : JsonResponse
    {

        $rates = $this->getRates();


        $amount = floatval($request->amount);
        $from = floatval($rates[$request->from]);
        $to = floatval($rates[$request->to]);
        $value = $amount * ($to / $from);


        return JsonResponse::create(['value' => number_format( $value , 2, ',', '.')],200);

    }

    private static function getRates(){

        // creates/updates rates cache after 1 hour, if file doesnt exists or file size is equal 0. I've did this to control how many exchange rates would be request per day to save $$$, could be more, less or realtime

        if(!Cache::store('redis')->has('currencies')) {

            $queryString = http_build_query([
                "app_id" => env('OPEN_EXCHANGE_RATES_APP_ID'),
                "base" => "USD",
                "symbols" => "USD,BRL,EUR,BTC,ETH",
                "show_alternative" => 1
            ]);

            $oxr_url = "https://openexchangerates.org/api/latest.json?" . $queryString;

            $ch = curl_init($oxr_url);

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

            $data = curl_exec($ch);

            curl_close($ch);

            $json = json_decode($data);

            Cache::store('redis')->put('currencies', json_encode($json->rates), 3600);

        }

        $rates =  Cache::store('redis')->get('currencies');

        return json_decode($rates,true);
    }
}