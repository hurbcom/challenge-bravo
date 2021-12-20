<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Currency extends Model
{
    protected $collection = 'currencies';
}
