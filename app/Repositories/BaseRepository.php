<?php

namespace App\Repositories;

class BaseRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = $this->resolveModel();
    }

    public function getAll()
    {
        return $this->model->get();
    }

    public function first()
    {
        $this->model = $this->model->first();

        return $this;
    }

    public function firstOrFail()
    {
        $this->model = $this->model->firstOrFail();

        return $this;
    }

    public function select(...$fields)
    {
        return $this->model
            ->select($fields)
            ->get();
    }

    public function selectFields(...$fields)
    {
        $this->model = $this->model->select($fields);

        return $this;
    }

    public function findById($id)
    {
        return $this->model->find($id);
    }

    public function findOrFail($id)
    {
        return $this->model->findOrFail($id);
    }

    public function findWhereField($column, $field)
    {
        $this->model = $this->model->where($column, $field);

        return $this;
    }

    public function findWhere($column, $valor)
    {
        return $this->model
            ->where($column, $valor)
            ->get();
    }

    public function findWhereNoGet($column, $valor)
    {
        return $this->model
            ->where($column, $valor);
    }

    public function findWhereFirst($column, $valor)
    {
        return $this->model
            ->where($column, $valor)
            ->first();
    }

    public function paginate($totalPage = 15)
    {
        return $this->model->paginate($totalPage);
    }

    public function store(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $request)
    {
        $model = $this->findWhereFirst('id', $id);

        if(!$model) {
            return false;
        }

        return $model->update($request);
    }

    public function updateByUuid(string $uuid, array $request)
    {
        $model = $this->findWhereFirst('uuid', $uuid);

        if(!$model) {
            return false;
        }

        return $model->update($request);
    }

    public function updateSingle($id, $field, $value)
    {
        $model = $this->findById($id);

        if(!$model) {
            return false;
        }

        $data[$field] = $value;
        return $model->update($data);
    }

    public function delete($id)
    {
        $model = $this->findById($id);

        if(!$model) {
            return false;
        }

        return $model->delete();
    }

    public function deleteByUuid(string $uuid)
    {
        $model = $this->findWhereFirst('uuid', $uuid);

        if(!$model) {
            return false;
        }

        return $model->delete();
    }

    public function relationships(...$relationships)
    {
        $this->model = $this->model->with($relationships);

        return $this;
    }

    public function orderBy($column, $order = 'DESC')
    {
        $this->model = $this->model->orderBy($column, $order);

        return $this;
    }

    public function resolveModel()
    {
        if (!method_exists($this, 'model')) {
            throw new NotModelDefined();
        }

        //Cria objeto do Model informado
        return app($this->model());
    }
}
