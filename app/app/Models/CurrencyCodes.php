<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurrencyCodes extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'idrate';

    /**
     * The attributes that are mass assignable.
     *
     * @var (array)
     * @access protected
     */
    protected $fillable = ['code', 'default'];
}