<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * Class Currency
 * @package App\Models\Currency
 * @property int $id
 * @property string $code
 * @property float $price
 */
class Currency extends Model
{
    use HasFactory;

    protected $table = 'currency';

    protected $fillable = [
        'code',
        'price',
        'created_at'
    ];

    /**
     * Find currency by code
     * @param String $code
     *
     * @return Builder|Model|null
     */
    public function findByCode(String $code)
    {
        return $this->query()->firstWhere(['code' => $code]);
    }

    /**
     * Find currency by id
     * @param Int $id
     *
     * @return Builder|Model|null
     */
    public function findById(Int $id)
    {
        return $this->query()->find($id);
    }

    /**
     * Build
     * @param array $awesomeApi
     *
     * @return array
     */
    public static function mapAwesomeApiToCurrency($awesomeApi): array
    {
        return [
            'code' => $awesomeApi['code'] ?? null,
            'price' => $awesomeApi['bid'] ?? null,
            'created_at' => $awesomeApi['create_date'] ?? null,
        ];
    }

}
