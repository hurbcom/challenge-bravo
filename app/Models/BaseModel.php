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
    protected $options=[];

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

    public function exists()
    {
        return !empty($this->first());
    }

    public function first()
    {
        return $this->limit(1)->get()[0];
    }

    public function get()
    {
        $this->manager = new Manager($this->getConnectionString());
        $query = new Query($this->wheres, $this->options);
        $cursor = $this->manager->executeQuery('db.'.$this->getTableName(), $query);
        $return = [];
        foreach ($cursor as $document) {
            $return[] = new $this((array)$document);
        }
        return $return;
    }

    public function limit($number)
    {
        $this->options['limit'] = $number;
        return $this;
    }

    public function insert($params)
    {
        $params['_id'] = md5(uniqid(""));
        $this->manager = new Manager($this->getConnectionString());
        $bulk = new BulkWrite;
        $bulk->insert($params);
        $write = $this->manager->executeBulkWrite('db.'.$this->getTableName(), $bulk);
        if ($write->getInsertedCount() != 1) {
            return false;
        }
        return $params;
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
        if (empty($params)) {
            return false;
        }
        $this->manager = new Manager($this->getConnectionString());
        $bulk = new BulkWrite;
        $bulk->update($this->wheres, ['$set' => $params]);
        $result = $this->manager->executeBulkWrite('db.'.$this->getTableName(), $bulk);
        if ($result->getModifiedCount() != 1) {
            return false;
        }
        return true;
    }

    public function delete()
    {
        $this->manager = new Manager($this->getConnectionString());
        $bulk = new BulkWrite;
        $bulk->delete($this->wheres, ['limit' => 1]);
        $result = $this->manager->executeBulkWrite('db.'.$this->getTableName(), $bulk);
        if ($result->getDeletedCount()!=1) {
            return false;
        }
        return true;
    }

    private function getTableName()
    {
        return $this->tablename ?? strtolower(str_replace(__NAMESPACE__.'\\', '', get_class($this)));
    }


    protected function getConnectionString()
    {
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