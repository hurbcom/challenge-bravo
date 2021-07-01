<?php

namespace App;

use App\Models\Currency;
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
        echo json_encode($this->model->get());
    }

    public function store()
    {
        $validator = Validator::make($this->request->all(['name', 'base', 'baseRate']), [
            'name' => 'required|is_upercase',
            'base' => 'required|is_upercase',
            'baseRate' => 'required_if:base<>USD|numeric'
        ]);

        if ($validator->fails()) {
            echo json_encode($validator->getErrors());
            exit;
        }
        echo json_encode($this->model->insert($this->request->all(['name', 'base', 'baseRate'])));
    }

    public function delete($name)
    {
        echo json_encode($this->model->where('name', $name)->delete());
    }

    public function update($name)
    {
        echo json_encode($this->model->where('name', $name)->update($this->request->all(['name', 'base'])));
    }
}