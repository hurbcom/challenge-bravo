<?php

namespace App\Http\Controllers\Awesame;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public $response;

    const BASE_URL = 'https://economia.awesomeapi.com.br/json';


    /**
     * Método responsável por consultar a cotação atual das moedas
     *
     * @param Request
     * @return array 
     */

    public function last(Request $request)
    {
        return $this->get('/last/' . $request->from . '-' . $request->to);
    }

    /**
     * Método responsável por consultar a cotação atual de uma ou várias moedas
     *
     * @param 
     * @return array 
     */
    public function lastCoin($coin)
    {
        return $this->get('/last/' . $coin);
    }

    /**
     * Método responsável por consultar a cotação por período
     *
     * @param Request
     * @return array 
     */
    public function daily(Request $request)
    {
        return $this->get('/daily/' . $request->from . '-' . $request->to . '/' .  $request->num);
    }

    public function getQuotesCoins($from, $to, $num = null)
    {
        if ($num != null) {
            $url = $from . '-' . $to . '/' .  $num;
        } else {
            $url =  $from . '-' . $to;
        }
        return $this->get('/daily/' . $url);
    }

    /**
     * Método responsável por executar a requisição na API Awesome
     *
     * @param Request
     * @return array 
     */
    public function get($resource)
    {
        $endpoint = self::BASE_URL . $resource;

        //inicia a curl
        $curl = curl_init();

        // configurando o curl
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_URL, $endpoint);
        curl_setopt($curl, CURLOPT_HEADER, 0);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');

        // executa o curl
        $this->response = curl_exec($curl);

        // fecha a conexao do curl
        curl_close($curl);

        // retorna o json como array 
        return json_decode($this->response, true);
    }
}
