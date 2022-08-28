<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricoCotacao extends Model
{
    use HasFactory;

    protected $table = 'historico_cotacao';

    protected $fillable = [
        'user_id',
        'code',
        'codein',
        'name',
        'high',
        'low',
        'varBid',
        'pctChange',
        'bid',
        'ask',
        'timestamp',
        'create_date',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    }
}
