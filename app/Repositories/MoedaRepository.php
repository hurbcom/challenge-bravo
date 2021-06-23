<?php

namespace App\Repositories;

use App\Models\Models\Moeda;

class MoedaRepository extends AbstractRepository
{
    public function __construct(Moeda $model)
    {
        $this->model = $model;
    }
}