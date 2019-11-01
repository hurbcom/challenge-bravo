<?php

/**
 * Currency Class
 *
 * Makes database operations 
 * 
 * @see DbPDO.class
 *
 */
class Currency {

    /**
     * Gets a currency.
     *
     * @param	string $code Currency code.
     * @return	mixed.
     */
    function get($code)
    {
        $sql = "SELECT * FROM currency WHERE code = :code";
        $pdo = new DbPDO();
        $pdo->query($sql);
        $pdo->bind(':code', $code);
        return $pdo->single();
    }

    /**
     * Gets all currencies.
     *
     * @return	mixed.
     */
    function getAll()
    {
        $pdo = new DbPDO();
        $sql = "SELECT * FROM currency";
        $pdo->query($sql);
        $rows = $pdo->resultset();
        $total = $pdo->rowCount();
        if ($total !== 0)
        {
            return $rows;
        }
        return FALSE;
    }

    /**
     * Inserts a currency.
     *
     * @param	string $code Currency code.
     * @param	string $name Currency name.
     * @param	int $is_crypto 1 cryptocurrency / 0 regular.
     * @return	mixed.
     */
    function create($code, $name, $is_crypto)
    {
        $pdo = new DbPDO();
        $sql = "INSERT INTO currency (code, name, is_crypto) VALUES (:code, :name, :is_crypto)";
        $pdo->query($sql);
        $pdo->bind(':code', $code);
        $pdo->bind(':name', $name);
        $pdo->bind(':is_crypto', $is_crypto);

        try
        {
            $pdo->execute();
            return TRUE;
        }
        catch (PDOException $ex)
        {
            return FALSE;
        }
    }

    /**
     * Deletes a currency.
     *
     * @param	string $code Currency code.
     * @return	mixed.
     */
    function delete($code)
    {
        $pdo = new DbPDO();
        $sql = "DELETE FROM currency WHERE code = :code";
        $pdo->query($sql);
        $pdo->bind(':code', $code);

        try
        {
            $pdo->execute();
            return TRUE;
        }
        catch (PDOException $ex)
        {
            return FALSE;
        }
    }

}
