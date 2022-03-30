<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Currency
 * @package App\Models\Currency
 * @property int $id
 * @property string $code
 * @property float $rate
 */
class Currency extends Model
{
    protected $table = 'currency';

    protected $fillable = [
        'code', 'rate'
    ];
}
