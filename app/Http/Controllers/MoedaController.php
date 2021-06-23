<?php

namespace App\Http\Controllers;

use App\Repositories\MoedaRepository;
use Illuminate\Http\Request;

class MoedaController extends BaseController
{
    public function __construct(MoedaRepository $moedaRepository)
    {
        parent::__construct($moedaRepository);
    }
}
