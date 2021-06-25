<?php

namespace App\Http\Controllers;

use App\Http\Requests\MoedaRequest;
use App\Repositories\MoedaRepository;
use Illuminate\Http\Request;

class MoedaController extends BaseController
{
    public function __construct(MoedaRepository $moedaRepository, MoedaRequest $rules)
    {
        parent::__construct($moedaRepository, $rules);
    }
}
