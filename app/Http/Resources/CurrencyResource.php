<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     title="Currency Resource",
 *     description="Resource para padronizar as respostas dos endpoints em formato json:api. https://jsonapi.org/",
 *     @OA\Xml(
 *         name="CurrencyResource"
 *     )
 * )
 */
class CurrencyResource extends JsonResource
{
    /**
     * @OA\Property(
     *     title="Data",
     *     description="Data wrapper"
     * )
     *
     * @var \App\Models\Currency[]
     */
    private $data;

    /**
     * @OA\Property(
     *     title="links",
     *     description="Data wrapper",
     *     property="links",
     *     type="array",
     *     @OA\Items(
     *         @OA\Property(property="first", type="integer", example=".../api/v1/currencies?page=1"),
     *         @OA\Property(property="last", type="integer", example=".../api/v1/currencies?page=2"),
     *         @OA\Property(property="prev", type="integer", example="null"),
     *         @OA\Property(property="next", type="integer", example="null"),
     *     ),
     * )
     */
    private $links;

    /**
     * @OA\Property(
     *     title="Meta",
     *     description="Data wrapper",
     *     property="meta",
     *     type="array",
     *     @OA\Items(
     *         @OA\Property(property="current_page", type="integer", example="1"),
     *         @OA\Property(property="from", type="integer", example="1"),
     *         @OA\Property(property="last_page", type="integer", example="1"),
     *         @OA\Property(property="path", type="string", example=".../api/v1/currencies"),
     *         @OA\Property(property="per_page", type="integer", example="15"),
     *         @OA\Property(property="to", type="integer", example="2"),
     *         @OA\Property(property="total", type="integer", example="2"),
     *     ),
     * )
     */
    private $metas;

    public function toArray($request) : array
    {
        return [
            'id'                => $this->id,
            'codeCurrency'      => $this->code_currency,
            'baseCurrency'      => $this->base_currency,
            'equivalent_value'  => $this->equivalent_value,
        ];
    }
}
