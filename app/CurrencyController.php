<?php

namespace App;

use App\Models\Currency;
use App\Services\ExchangeService;
use Src\Request;
use Src\Validator;

class CurrencyController extends Controller
{
    private $model;

    public function __construct(Request $request)
    {
        $this->model = new Currency();
        parent::__construct($request);
    }

    public function index()
    {
        $return = [];
        $apiRates = (new ExchangeService())->latest();
        foreach ($apiRates as $currName => $base) {
            if (isset($this->request->base) && strtoupper($this->request->base) != 'USD') {
                continue;
            }
            if (isset($this->request->name) && strtoupper($currName) != strtoupper($this->request->name)) {
                continue;
            }
            $return[] = ['name' => strtoupper($currName), 'base' => 'USD', 'baseRate' => $base];
        }
        $model = $this->model;
        if ($this->request->all(['name', 'base'])) {
            foreach ($this->request->all(['name', 'base']) as $field => $value) {
                $model = $model->where($field, $value);
            }
        }
        echo json_encode($model->get()+$return);
    }

    public function store()
    {
        $params = $this->request->all(['name', 'base', 'baseRate']);
        $validator = Validator::make($params, [
            'name' => 'required|is_upercase|unique:currency',
            'base' => 'is_upercase',
            'baseRate' => 'required_if:base<>USD|numeric'
        ]);

        if ($validator->fails()) {
            echo json_encode($validator->getErrors());
            exit;
        }

        if (empty($params['base'])) {
            $params['base'] = 'USD';
        }

        echo json_encode($this->model->insert($params));
    }

    public function delete($name)
    {
        echo json_encode($this->model->where('name', $name)->delete());
    }

    public function update($name)
    {
        $validator = Validator::make($this->request->all(['name', 'base', 'baseRate']), [
            'name' => 'is_upercase|unique:currency',
            'base' => 'is_upercase',
            'baseRate' => 'required_if:base<>USD|numeric'
        ]);

        if ($validator->fails()) {
            echo json_encode($validator->getErrors());
            exit;
        }
        $currency = $this->model->where('name', $name)->first();
        if (!$currency) {
            throw new \Exception('Currency not found');
        }
        if ($this->model->where('name', $name)->update($this->request->all(['name', 'base', 'baseRate']))) {
            echo json_encode(array_merge(json_decode(json_encode($currency), true), $this->request->all(['name', 'base', 'baseRate'])));
        }
    }
}