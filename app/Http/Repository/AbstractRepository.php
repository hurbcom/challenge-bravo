<?php
namespace App\Repository;

use Illuminate\Database\Eloquent\Model;

abstract class AbstractRepository
{
    /**
     * @var Model
     */
    private $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function selectCoditions($coditions)
    {
        $expressions = explode(";", $coditions);

        foreach ($expressions as $e) {
            $exp = explode(":", $e);
            $this->model = $this->model->where($exp[0], $exp[1], $exp[2]);
        }
    }

    public function selectFilter($filters)
    {
        $this->model= $this->model->selectRaw($filters);
    }

    public function getResult()
    {
        return $this->model;
    }
}
