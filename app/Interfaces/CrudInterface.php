<?php

namespace App\Interfaces;

interface CrudInterface
{
    /**
     * Busca todos os dados
     *
     * @return array
     */
    public function getAll();

    /**
     * Criar um novo item
     *
     * @param array $data
     * @return object Created Currency
     */
    public function create(array $data);

    /**
     * Deleta moeda pelo ID
     *
     * @param int $id
     * @return object Deleted Currency
     */
    public function delete(int $id);

    /**
     * Busca moeda pelo ID
     *
     * @param int $id
     * @return object Get Currency
     */
    public function getByID(int $id);

    /**
     * Atualiza moeda pelo ID e dados
     *
     * @param int $id
     * @param array $data
     * @return object Updated Currency Information
     */
    public function update(int $id, array $data);
}