<?php

namespace App\Http\Controllers\Awesame;

use App\Http\Controllers\Awesame\ApiController;
use App\Http\Controllers\Awesame\TaxasController;
use App\Http\Controllers\Controller;
use Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\HistoricoCotacao as Historico;
use App\Mail\EnviaEmail;

class CotacaoController extends Controller
{

    protected $taxa;

    protected $conversao;

    public function __construct()
    {
        $this->taxa = new TaxasController;
    }

    /**
     * Display a listing of the users
     *
     * @param  \App\Models\HistoricoCotacao  $model
     * @return \Illuminate\View\View
     */
    public function index(Historico $model)
    {
        // $name = session()->get('name');

        // if (!isset($name)) {
        //     return redirect()->route('app.login', ['error' => 1]);
        // }


        return view('cotacao.index', ['cotacao' => $model->paginate(15)]);
    }

    public function store(ApiController $cotacao, Request $request)
    {

        $this->conversao = $this->taxa->toConvertBRL($cotacao, $request);

        if ($request->valor_conversao > $this->taxa::VALOR_MIN_COMPRA && $request->valor_conversao < $this->taxa::VALOR_MAX_COMPRA) {

            $this->execute($this->conversao);
        }

        return redirect()->route('app.historico.cotacoes');
    }
}
