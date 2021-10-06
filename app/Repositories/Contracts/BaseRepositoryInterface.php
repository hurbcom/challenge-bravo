<?php

namespace App\Repositories\Contracts;

interface BaseRepositoryInterface
{
    public function getAll();
    public function select();
    public function findById(int $id);
    public function first();
    public function firstOrFail();
    public function findWhere($column, $valor);
    public function findWhereFirst($column, $valor);
    public function paginate(int $totalPage = 15);
    public function store(array $data);
    public function update(int $id, array $request);
    public function updateSingle(int $id, $field, $value);
    public function delete(int $id);
    public function orderBy($column, string $order = 'DESC');
}
