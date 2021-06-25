<?php

namespace App\Repositories;

interface RepositoryInterface
{
    public function find($id);

    public function all();

    public function create(array $data);

    public function update(array $data, $id);

    public function firstOrCreate(array $data);

    public function deleteBy(string $key, $value);

    public function destroy($id);

    public function paginate($pages);
}