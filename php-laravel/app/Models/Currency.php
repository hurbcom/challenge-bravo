<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Currency extends Model
{
    protected $collection = 'currencies';

    protected $fillable = [
        'code',
        'bid',
        'updatedAt',
    ];

    protected $hidden = [
        '_id',
        'createdAt',
        '__v',
    ];

    protected $dates = ['updatedAt'];
}
