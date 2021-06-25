<?php

namespace App\Models;

use \MongoDB\Driver\Manager;
use \MongoDB\Driver\Query;
use \MongoDB\Driver\BulkWrite;

class BaseModel
{
    private $manager;
    private $wheres;
    protected $tablename;

    public function __construct()
    {
        $this->manager = new Manager($this->getConnectionString());
        return $this;
    }

    public function get()
    {
        $query = new Query([], []);
        $cursor = $this->manager->executeQuery('db.'.$this->getTableName(), $query);
        $return = [];
        foreach ($cursor as $document) {
            $return[] = $document;
        }
        return $return;
    }

    public function insert($params)
    {
        $bulk = new BulkWrite;
        $bulk->insert($params);
        $write = $this->manager->executeBulkWrite('db.'.$this->getTableName(), $bulk);
        print_r($write);
    }

    public function where($tableField, $tableValue)
    {
        $this->wheres[$tableField] = $tableValue;
        return $this;
    }

    public function update($params)
    {
        $bulk = new BulkWrite;
        $bulk->update($this->wheres, ['$set' => $params]);
        $result = $this->manager->executeBulkWrite('db.'.$this->getTableName(), $bulk);
        print_r($result);
    }

    public function delete()
    {
        $bulk = new BulkWrite;
        $bulk->delete($this->wheres, ['limit' => 1]);
        $result = $this->manager->executeBulkWrite('db.'.$this->getTableName(), $bulk);
        print_r($result);
    }

    private function getTableName()
    {
        return $this->tablename ?? strtolower(str_replace(__NAMESPACE__.'\\', '', get_class($this)));
    }


    protected function getConnectionString()
    {
        return "mongodb://".
            $_ENV['DB_USERNAME']
            .':'
            .$_ENV['DB_PASSWORD']
            .'@'
            .$_ENV['DB_HOST']
            .':'
            .$_ENV['DB_PORT'];
    }
}