<?php

namespace App;

use App\Models\Currency;
use Src\Request;

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
        echo 'dsa';exit;
        echo json_encode($this->model->get());
    }

    public function store()
    {
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