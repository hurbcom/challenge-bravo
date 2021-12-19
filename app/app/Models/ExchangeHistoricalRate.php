<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExchangeHistoricalRate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var (array)
     * @access protected
     */
    protected $fillable = ['code', 'rate', 'historical'];
}