<?php

namespace App\Models;

use \MongoDB\Driver\Manager;
use \MongoDB\Driver\Query;
use \MongoDB\Driver\BulkWrite;

class BaseModel implements \JsonSerializable
{
    private $manager;
    private $wheres=[];
    protected $tablename;
    protected $limit;

    protected $data;
    public function __get($name)
    {
        if (!in_array($name, array_keys($this->data))) {
            return null;
        }
        return $this->data[$name];
    }

    public function __construct($data=[])
    {
        try {
            $this->data = $data;
            return $this;
        } catch (\Exception $e) {
            echo $e->getMessage();
            exit;
        }
    }

    public function first()
    {
        //TODO fazer com limit
        return $this->get()[0];
    }

    public function get()
    {
        $this->manager = new Manager($this->getConnectionString());
        $query = new Query($this->wheres, []);
//        $query = new Query(['name' => ['$in' => ['BTC', 'EUR']]], []);
        $cursor = $this->manager->executeQuery('db.'.$this->getTableName(), $query);
        $return = [];
        foreach ($cursor as $document) {
            $return[] = new $this((array)$document);
        }
        return $return;
    }

    public function limit($number)
    {
        $this->limit = $number;
        return $this;
    }

    public function insert($params)
    {
        $this->manager = new Manager($this->getConnectionString());
        $bulk = new BulkWrite;
        $bulk->insert($params);
        $write = $this->manager->executeBulkWrite('db.'.$this->getTableName(), $bulk);
        print_r($write);
    }

    public function whereIn($tableField, $tableValue)
    {
        $this->wheres[$tableField]['$in'] = $tableValue;
        return $this;
    }

    public function where($tableField, $tableValue)
    {
        $this->wheres[$tableField] = $tableValue;
        return $this;
    }

    public function update($params)
    {
        $this->manager = new Manager($this->getConnectionString());
        $bulk = new BulkWrite;
        $bulk->update($this->wheres, ['$set' => $params]);
        $result = $this->manager->executeBulkWrite('db.'.$this->getTableName(), $bulk);
        print_r($result);
    }

    public function delete()
    {
        $this->manager = new Manager($this->getConnectionString());
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
//        return 'mongodb+srv://root:mOiOM5E5CcMO0qMH@cluster0.e4qlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority:27017';
        return $_ENV['DB_URI_SCHEMA']
            ."://"
            .$_ENV['DB_USERNAME']
            .':'
            .$_ENV['DB_PASSWORD']
            .'@'
            .$_ENV['DB_HOST']
            .':'
            .$_ENV['DB_PORT'];
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return $this->data;
    }
}