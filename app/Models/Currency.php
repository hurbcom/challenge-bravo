<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     title="Currency model",
 *     description="Currency model",
 * )
 */
class Currency extends Model
{
    /**
     * @OA\Property(
     *     format="int64",
     *     description="ID",
     *     title="ID",
     *     example="22"
     * )
     *
     * @var integer
     */
    private $id;

    /**
     * @OA\Property(
     *     description="Code Currency",
     *     title="Code Currency",
     *     example="hurb"
     * )
     *
     * @var string
     */
    private $code_currency;

    /**
     * @OA\Property(
     *     description="Base Currenci (Lastro)",
     *     title="Base Currency",
     *     example="usd"
     * )
     *
     * @var string
     */
    private $base_currency;

    /**
     * @OA\Property(
     *     format="float",
     *     description="Equivalent Value",
     *     title="Equivalent Value",
     *     example=3.1456
     * )
     *
     * @var float
     */
    private $equivalent_value;

    use HasFactory;

    protected $fillable = ['code_currency', 'base_currency', 'equivalent_value'];

    public function setCodeCurrencyAttribute($value) : void
    {
        $this->attributes['code_currency'] = strtolower($value);
    }

    public function setBaseCurrencyAttribute($value) : void
    {
        $this->attributes['base_currency'] = strtolower($value);
    }
}
