<?php

namespace App\Repository;

use App\Models\Quotation;

class QuotationRepository extends BaseRepository {

    public function __construct(Quotation $quotation)
    {
        $this->model = $quotation;
    }
}