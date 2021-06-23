<?php

namespace App\Models;

use App\Models\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;

class Moeda extends Model
{
    use UuidTrait;

    protected $primaryKey = 'uid';
    protected $keyType = 'string';
    public $incrementing = false;
    public $fillable = [
        'nome',
        'nome_exibicao',
    ];
}
