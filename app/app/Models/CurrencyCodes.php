<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\CurrencyCodesFactory;

class CurrencyCodes extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var (string)
     * @access protected
     */
    protected $primaryKey = 'idcode';

    /**
     * The attributes that are mass assignable.
     *
     * @var (array)
     * @access protected
     */
    protected $fillable = ['code', 'default'];

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return CurrencyCodesFactory::new();
    }
}