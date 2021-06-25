<?php

namespace App;

class CurrencyController extends Controller
{
    public function store()
    {
        print_r($this->request->all());
        print_r($this->request->all(['teste']));
        echo 'dsa';
//        $data = json_decode(file_get_contents('php://input'), true);
//        print_r($data);
//        print_r($_REQUEST);
    }
}