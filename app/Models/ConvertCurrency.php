<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConvertCurrency extends Model
{
    protected $table = "convert_currencies";
        protected $fillable = ["code", "bid", "create_date"];

}
