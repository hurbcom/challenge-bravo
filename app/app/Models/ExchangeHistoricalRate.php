<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\ExchangeHistoricalRatesFactory;

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

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return ExchangeHistoricalRatesFactory::new();
    }
}