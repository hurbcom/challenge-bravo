<?php

namespace App;

use App\Models\ExchangeRate;
use App\Models\Currency;
use App\Services\ExchangeService;
use Src\Request;
use Src\Validator;

class ExchangeRatesController extends Controller
{
    public function __construct(Request $request)
    {
        $this->model = new ExchangeRate(new ExchangeService());
        parent::__construct($request);
    }

    public function index()
    {
        $validator = Validator::make($this->request->all(['from', 'to', 'amount']), [
            'from' => 'required',
            'to' => 'required',
            'amount' => 'required|numeric'
        ]);
        if ($validator->fails()) {
            echo json_encode($validator->getErrors());
            exit;
        }
        echo json_encode($this->model->from(new Currency(['name' => $this->request->from]))
            ->to(new Currency(['name' => $this->request->to]))
            ->amount($this->request->amount)
            ->get());
    }
}