<?php

use Phinx\Migration\AbstractMigration;

class Start extends AbstractMigration
{
    public function change()
    {
        date_default_timezone_set('UTC');

        $table = $this->table('currency', ['id' => false, 'primary_key' => 'id']);
        $table->addColumn('id', 'char', ['limit' => 36])
            ->addColumn('createdAt', 'datetime')
            ->addColumn('updatedAt', 'datetime')
            ->addColumn('name', 'string', ['limit' => 3])
            ->create();

        $now = date('Y-m-d H:i:s');

        $this->table($table->getName())
            ->insert([
                [
                    'id' => '84fea129-fd33-4e90-be11-ba128c942d16',
                    'name' => 'USD',
                    'createdAt' => $now,
                    'updatedAt' => $now,
                ],
                [
                    'id' => '84fea129-fd84-402d-b4b4-dee6ea420b4c',
                    'name' => 'BRL',
                    'createdAt' => $now,
                    'updatedAt' => $now,
                ],
                [
                    'id' => '84fea129-fd91-42e2-9969-31c1db08261b',
                    'name' => 'EUR',
                    'createdAt' => $now,
                    'updatedAt' => $now,
                ],
                [
                    'id' => '84fea129-fd9d-4762-b900-f249eb758f87',
                    'name' => 'BTC',
                    'createdAt' => $now,
                    'updatedAt' => $now,
                ],
                [
                    'id' => '84fea129-fdb4-4993-b499-e21fef0596b2',
                    'name' => 'ETH',
                    'createdAt' => $now,
                    'updatedAt' => $now,
                ]
            ]
        )->save();
    }
}
