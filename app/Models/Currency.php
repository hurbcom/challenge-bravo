<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Currency extends Model
{
    use SoftDeletes;

    protected $table = "tb_currencies";
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    protected $fillable = [
        "st_short_name",
        "st_descrtption",
    ];

    public function latestQuotation()
    {
        return $this->hasOne(Quotation::class)->latestOfMany();
    }
}
