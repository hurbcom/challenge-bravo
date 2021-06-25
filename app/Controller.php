<?php

namespace App;

use Src\Request;

class Controller
{
    public $request;
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

//    public function teste($uid)
//    {
//        $manager = new \MongoDB\Driver\Manager("mongodb://root:A123456@hurb_mongodb:27017");
//
//        $bulk = new \MongoDB\Driver\BulkWrite;
//        $bulk->insert(['x' => 1]);
//        $bulk->insert(['x' => 2]);
//        $bulk->insert(['x' => 3]);
//        $manager->executeBulkWrite('db.test', $bulk);
//
//        $filter = ['x' => ['$gt' => 1]];
//        $options = [
//            'projection' => ['_id' => 0],
//            'sort' => ['x' => -1],
//        ];
//
//        $query = new \MongoDB\Driver\Query($filter, $options);
//        $cursor = $manager->executeQuery('db.test', $query);
//
//        foreach ($cursor as $document) {
//            print_r($document);
//        }
//
//        echo 'FOI AQUI'.$uid;
//    }
}