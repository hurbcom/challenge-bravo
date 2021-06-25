<?php

namespace App;

class CurrencyController extends Controller
{
    public function store()
    {
        $manager = new \MongoDB\Driver\Manager("mongodb://root:A123456@hurb_mongodb:27017");
        $bulk = new \MongoDB\Driver\BulkWrite;
        $bulk->insert($this->request->all(['name', 'base']));
        $manager->executeBulkWrite('db.test', $bulk);
    }

    public function index()
    {
        $manager = new \MongoDB\Driver\Manager("mongodb://root:A123456@hurb_mongodb:27017");
        $query = new \MongoDB\Driver\Query([], []);
        $cursor = $manager->executeQuery('db.test', $query);
        $return = [];
        foreach ($cursor as $document) {
            $return[] = $document;
        }
        echo json_encode($return);
    }

    public function delete($name)
    {
        $manager = new \MongoDB\Driver\Manager("mongodb://root:A123456@hurb_mongodb:27017");
        $bulk = new \MongoDB\Driver\BulkWrite;

        $bulk->delete(['name' => $name], ['limit' => 1]);
        $result = $manager->executeBulkWrite('db.test', $bulk);
        print_r($result->getDeletedCount());
    }

    public function update($name)
    {
        $manager = new \MongoDB\Driver\Manager("mongodb://root:A123456@hurb_mongodb:27017");
        $bulk = new \MongoDB\Driver\BulkWrite;

        $bulk->update(['name' => $name], ['$set' => $this->request->all(['name', 'base'])]);
        $result = $manager->executeBulkWrite('db.test', $bulk);
        print_r($result);
    }
}