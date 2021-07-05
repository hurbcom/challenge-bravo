<?php

namespace App;

use Src\Request;

class Controller
{
    public $request;
    public function __construct(Request $request)
    {
        $this->request = $request;
    }
}