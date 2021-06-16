<?php

namespace App\Contracts;

interface BaseRepositoryInterface
{
   /**
     * @param array $with
     * @param integer $paginate
     * @param ...$conditions
     * @return object
     */
    public function allByCondition(array $with = [], int $paginate = 100, ...$conditions): object;
    
    /**
     *
     * @param array $with
     * @param integer $paginate
     * @return object
     */
    public function all(array $with = [], int $paginate = 100): object;
    /**
     *
     * @param object $data
     * @return object
     */
    public function create(array $data, array $with = []): object;
    /**
     *
     * @param integer $id
     * @param array $with
     * @return object
     */
    public function find(int $id, array $with = []): object;
    /**
     *
     * @param object $data
     * @param integer $id
     * @return object
     */
    public function update(array $data, int $id): object;
    /**
     *
     * @param integer $id
     * @return boolean
     */
    public function destroy(int $id): bool;
}
