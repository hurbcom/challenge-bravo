<?php

namespace App\Http\Controllers\Api;

use App\Api\ApiMessages;
use App\Currency;
use App\Http\Controllers\Controller;
use App\Http\Requests\CurrencyRequest;
use App\Http\Resources\CurrencyCollection;
use App\Repository\CurrencyRepository;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    private $currency;

    public function __construct(Currency $currency)
    {
        $this->currency = $currency;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $currencyRepository = new CurrencyRepository($this->currency);

            if($request->has("coditions")) {
                $currencyRepository->selectCoditions($request->coditions);
            }

            if($request->has("fields")) {
                $currencyRepository->selectFilter($request->fields);
            }

            $currencies = $currencyRepository->getResult()->paginate(10);

            return new CurrencyCollection($currencies);

        } catch (QueryException $e) {
            $message = new ApiMessages($e->getMessage());
            return response()->json($message->getMessage(), 401);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CurrencyRequest $request)
    {
        try {
            $currencyRepository = new CurrencyRepository($this->currency);
            $currencyRepository->storeCurrency($request);

            $message = new ApiMessages("Currency sucessfully created");
            return response()->json($message->getMessage());
        } catch (QueryException $e) {
            $message = new ApiMessages($e->getMessage());
            return response()->json($message->getMessage(), 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
