<?php

namespace App\Http\Controllers\Awesame;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Awesame\ApiController as Api;
use Illuminate\Http\Request;
use App\Models\HistoricoCotacao as Historico;
use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class HistoricoCotacaoController extends Controller
{
    private $historico;
    private $api;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Historico $historico, Api $api)
    {
        $this->historico = $historico;
        $this->api = $api;
    }

    /**
     * Display a listing of the historicos
     *
     * @param  \App\Models\HistoricoCotacao  $model
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $userid = Auth::id();

        $historico = $this->historico->where('user_id', $userid)->orderBy('id', 'desc')->paginate(10);

        return view('cotacao.index', ['cotacao' => $historico]);
    }


    /**
     * Recebe paramentros retorno json da API
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $userid = Auth::id(); //Id do Coatação logado
        $retorno = $this->importarCotacao($request);
        $return = [];
        $count = 0;
        $temp = [];

        if (empty($retorno["status"])) {

            foreach ($retorno as $row) {

                if ($count == 0) {
                    $temp["code"] = $row["code"];
                    $temp["codein"] = $row["codein"];
                    $temp["name"] = $row["name"];
                    $temp["create_date"] = $row["create_date"];
                } else {
                    $row["code"] = $temp["code"];
                    $row["codein"] = $temp["codein"];
                    $row["name"] = $temp["name"];
                    $row["create_date"] = $temp["create_date"];
                }

                if (!$this->verificaCotacao($row, $userid)) {
                    $row['user_id'] = $userid;

                    $return[$count]['status'] = $this->execute($row) ? true : false;
                    $return[$count]['create_date'] = $row['create_date'];
                } else {
                    $return[$count]['status'] = false;
                    $return[$count]['create_date'] = now();
                }

                $count++;
            }
            return json_encode($return);
        } else {
            return json_encode($retorno);
            //             "status" => 404
            //   "code" => "CoinNotExists"
            //   "message" => "moeda nao encontrada BRL-BRL"
        }
    }



    /**
     * Recebe paramentros retorno json da API
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveCotacao(Request $request)
    {
        $userid = Auth::id(); //Id do Coatação logado

        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'code' => 'required|string',
                'codein' => 'required|string',
                'bid' => 'required',
                'ask' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validator->errors()
                ], 401);
            }

            $request['user_id'] = $userid;
            $request['timestamp'] = strtotime(now());
            $request['create_date'] = now();

            $create = $this->historico->create($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Usuário cadastro com sucesso!!!',
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }


    /**
     * Recebe paramentros retorno json da API
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCotacao(Request $request, $id)
    {
        $userid = Auth::id(); //Id do Coatação logado

        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'code' => 'required|string',
                'codein' => 'required|string',
                'bid' => 'required',
                'ask' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validator->errors()
                ], 401);
            }

            $request['user_id'] = $userid;

            $cotacao = $this->historico->find($id);
            $cotacao->update($request->all());
            $cotacao->save();

            if ($cotacao) {
                return response()->json([
                    'status' => true,
                    'message' => 'Cotação atualizado com sucesso!',
                ], 200);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Recebe paramentros retorno json da API
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function lastCoin(Request $request)
    {

        $return = $this->api->lastCoin($request->cotacao);

        return json_encode($return);
    }

    public function importarCotacao($request)
    {

        $from = str_replace(",", ".", $request->from);
        $to = str_replace(",", ".", $request->to);
        $num = ($request->num) ? $request->num : null;

        // retorna a cotação da moeda atual
        $cotacaoMoeda = $this->api->getQuotesCoins($from, $to, $num);

        return $cotacaoMoeda;
    }

    protected function execute($dados)
    {

        return DB::table('historico_cotacao')->insert($dados);

        // return $this->historico->created($dados);
        // Pega o e-mail do Coatação logado
        // $destinatario = session()->get('email');

        // mail::to($destinatario)->send(new EnviaEmail([
        //     'historico_id' => $conversao['historico_id'],
        //     'taxa_conversao' => $conversao['taxa_conversao'],
        //     'taxa_pagamento' => $conversao['taxa_pagamento'],
        //     'moeda_destino' => $conversao['moeda_destino'],
        //     'moedas_comprada' => $conversao['moedas_comprada'],
        //     'total_conversao' => $conversao['total_conversao'],
        //     'moeda' => $conversao['moeda']
        // ]));
    }

    //Verifica se usário já importou uma cotação nesse período
    protected function verificaCotacao($cotacao, $id)
    {
        $historico = DB::table('historico_cotacao')
            ->where('user_id', $id)
            ->where('name', $cotacao["name"])
            ->where('create_date', $cotacao["create_date"])
            ->get();

        if (isset($historico[0])) {
            return true;
        } else {
            return false;
        }
    }

    public function destroy($id)
    {
        $historico = $this->historico->find($id);
        if ($historico) {
            $historico->delete();

            return response()
                ->json([
                    'data' => $historico,
                    'message' => 'Coatação foi removido com sucesso!',
                    "status" => true
                ], 200);
        } else {
            return response()
                ->json([
                    'data' => $historico,
                    'message' => 'Coatação não encontrado',
                    "status" => false
                ], 404);
        }
    }

    public function show($id)
    {
        $historico = $this->historico->find($id);

        if ($historico) {
            return response()->json([
                'status' => true,
                'message' => 'Cotação encontrado!',
                'data' => $historico
            ], 202);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Coatação não encontrado',
            ], 404);
        }
    }
}
