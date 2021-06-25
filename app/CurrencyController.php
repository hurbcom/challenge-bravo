<?php

namespace App;

use App\Models\Currency;

class CurrencyController extends Controller
{
    public function index()
    {
        echo json_encode((new Currency())->get());
    }

    public function store()
    {
        echo json_encode((new Currency())->insert($this->request->all(['name', 'base'])));
    }

    public function delete($name)
    {
        echo json_encode((new Currency())->where('name', $name)->delete());
    }

    public function update($name)
    {
        echo json_encode((new Currency())->where('name', $name)->update($this->request->all(['name', 'base'])));
    }
}