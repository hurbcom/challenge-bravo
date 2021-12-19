<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Url access to internal API
     * 
     * @var (string)
     * @access protected
     */
    protected $sGolangApi = "http://api:9092";

    /**
     * Url access to real external API
     *
     * @var (string)
     * @access protected
     */
    protected $sRealExternalApiUrl = "https://freecurrencyapi.net/api/v2/latest?apikey=1b50e330-58e1-11ec-87d5-5bf2584da504&base_currency=";
}
