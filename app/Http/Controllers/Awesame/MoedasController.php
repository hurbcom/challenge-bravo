<?php

namespace App\Http\Controllers\Awesame;

use App\Http\Controllers\Controller;
use App\Models\Moedas;
use App\Http\Requests\StoreMoedasRequest;
use App\Http\Requests\UpdateMoedasRequest;


use Illuminate\Support\Facades\Auth;

use App\Models\HistoricoCotacao as Historico;

class MoedasController extends Controller
{
    public function __construct()
    {
        $this->taxa = new TaxasController;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreMoedasRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreMoedasRequest $request)
    {
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Moedas  $moedas
     * @return \Illuminate\Http\Response
     */
    public function show(Moedas $moedas)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Moedas  $moedas
     * @return \Illuminate\Http\Response
     */
    public function edit(Moedas $moedas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateMoedasRequest  $request
     * @param  \App\Models\Moedas  $moedas
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMoedasRequest $request, Moedas $moedas)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Moedas  $moedas
     * @return \Illuminate\Http\Response
     */
    public function destroy(Moedas $moedas)
    {
        //
    }
}
