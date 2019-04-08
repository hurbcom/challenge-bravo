<?php
/**
 * Created by PhpStorm.
 * User: j
 * Date: 27/03/19
 * Time: 16:12
 */


namespace App\Domains\Currency\Converter;


use Symfony\Component\HttpFoundation\JsonResponse;
use Illuminate\Filesystem\Filesystem;




class Convert {
    /**i
     * @return array
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

        $file = new Filesystem;
        $ratespath = './../storage/rates/rates.json';

        $currentTime = time();
        $fileTime = $file->exists($ratespath) ? $file->lastModified($ratespath) : 0;
        $diff = abs($currentTime - $fileTime);

        // creates/updates rates file after 1 hour, if file doesnt exists or file size is equal 0. I did this to control how many exchange rates would be request per day to save $$$, could be more, less or realtime
        if($diff > 3600 || $file->size($ratespath) == 0) {
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
            //is a database needed to store these values? if you decided for realtime exchange rates, not database needed at all
            $file->put($ratespath,json_encode($json->rates));

        }

        return json_decode($file->get($ratespath),true);
    }
}