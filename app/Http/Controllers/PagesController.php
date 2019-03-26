<?php

namespace App\Http\Controllers;

use App\Schedule;
use Illuminate\Http\Request;
use App\Library\Services\MoneyApi;
use Mockery\Exception;


class PagesController extends Controller
{
    public $moneyApi;

    public function __construct(MoneyApi $moneyApi)
    {
        $this->moneyApi = $moneyApi;
    }

    public function index()
    {
        return view('index');

    }

    protected function _getPrice($data){
        $return = [];

        $query = 'fsym='.$data['from'].'&tsyms='.$data['to'];

        $urlPath = '/price?'.$query;
        $price = $this->moneyApi->getService($urlPath, 'GET');

        if(!empty($price)){
            $return = json_decode(json_encode($price), true);
        }

        return $return;
    }



    public function convert(Request $request){

        if($request->isMethod('get')) {
            $data = $request->all();

            $currencies = ['USD','BRL', 'EUR', 'BTC', 'ETH'];

            if(
                 !empty($data)
              && !empty($data['from'])
              && in_array($data['from'],$currencies)
              && !empty($data['to'])
              && in_array($data['to'],$currencies)
              && !empty($data['amount'])
              && is_numeric($data['amount'])
              && $data['amount'] >= 0.01
            ){

                $val = $this->_getPrice($data);

                if(!empty($val[$data['to']])){

                    $data['converted_amount'] = $data['amount'] * $val[$data['to']];
                    return response(['success'=> true, 'message'=> 'Valor convertido com sucesso!', "content"=> $data],200);
                }

                return response(['success'=> false, 'message'=> 'Falha ao pegar dado', "content"=> []], 400);
            }

            return response(['success'=> false, 'message'=> 'Dados Inválida', "content"=> []], 400);
        }

        return response(['success'=> false, 'message'=> 'Operação Inválida', "content"=> []], 400);

    }

}
