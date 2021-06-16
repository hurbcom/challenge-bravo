<?php

namespace App\Repository;

use App\Contracts\BaseRepositoryInterface;
use Error;
use Exception;

abstract class BaseRepository implements BaseRepositoryInterface
{

    protected $model;

    public function setModel(Object $model)
    {
        $this->model = $model;
        return $this;
    }

    public function all(array $with = [], int $paginate = 100): object
    {
        try {
            if(!$paginate){
                return $this->model::with($with);
            }
            return $this->model::with($with)->paginate($paginate);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function allByCondition(array $with = [], int $paginate = 100, ...$conditions): object
    {
       
        try {
            $return = $this->model::where(...$conditions)->with($with)->paginate($paginate);
            return $return;
        } catch (Exception $e) {
            return new Exception($e->getMessage());
        }
    }


    public function create(array $data, array $with = []): object
    {
        try {
            $return = ($this->model::create($data));
            if (!empty($with)) {
                $return->load(...$with);
            }
            return $return;
        } catch (Error | Exception $e) {
            throw new Exception($e);
        }
    }

    public function find(int $id, array $with = []): object
    {
        try {
            return $this->model::with($with)->findOrFail($id);
        } catch (Error | Exception $e) {
            throw new Exception($e);
        }
    }

    public function update(array $data, int $id, array $with = []): object
    {
        try {
            if ($this->model::findOrFail($id)->update($data)) {

                return $this->model::with($with)->findOrFail($id);
            }
            throw new Exception("Dado não encontrado", 400);
        } catch (Error | Exception $e) {
            throw new Exception($e);
        }
    }

    public function destroy(int $id): bool
    {
        try {
            return (bool) ($this->model::find($id)->delete());
        } catch (Error | Exception $e) {
            throw new Exception($e);
        }
    }

}
