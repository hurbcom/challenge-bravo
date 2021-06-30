<?php

namespace App;

use App\Models\ExchangeRate;
use App\Models\Currency;
use App\Services\ExchangeService;
use Src\Request;

class ExchangeRatesController extends Controller
{
    public function __construct(Request $request)
    {
        $this->model = new ExchangeRate(new ExchangeService());
        parent::__construct($request);
    }

    public function index()
    {
        echo json_encode($this->model->from(new Currency(['name' => $this->request->from]))
            ->to(new Currency(['name' => $this->request->to]))
            ->amount($this->request->amount)
            ->get());
    }
}