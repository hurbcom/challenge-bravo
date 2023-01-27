<?php

namespace App\Repositories;

use App\Interfaces\CrudInterface;
use App\Models\Currency;

class CurrencyRepository implements CrudInterface
{
    /**
     * Pegar todas as moedas no banco de dados.
     *
     * @return collections
     */

    public function getAll()
    {
        return Currency::all();
    }
  

    /**
     * Cadastrar uma nova moeda.
     *
     * @param array $data
     * @return object Currency Object
     */
    public function create(array $data): Currency
    {
         return Currency::create($data);
    }

    /**
     * Deletar moeda.
     *
     * @param int $id
     * @return boolean true if deleted otherwise false
     */
    public function delete(int $id)
    {
        $currency = Currency::find($id);

        if (empty($currency)) {
            return false;
        }

        if($currency->fake === 0)
        {
            $currency->delete($currency);
            return "FALSE_COIN";
        }       
        return true;
        
    }

    /**
     * Buscar moeda pelo ID.
     *
     * @param int $id
     * @return void
     */
    public function getByID(int $id): Currency|null
    {
        return Currency::find($id);
    }

    /**
     * Atualizar moeda pelo ID.
     *
     * @param int $id
     * @param array $data
     * @return object Updated Currency Object
     */
    public function update(int $id, array $data)
    {
        $currency = Currency::find($id);

        if (is_null($currency)) {
            return null;
        }

        if($currency->fake === 1)
        {
            return "TRUE_COIN";
        }       
        
        // Se estiver Ok, faça a atualização.
        $currency->update($data);        
        return $this->getByID($currency->id);

    }
}
