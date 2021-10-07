<?php


use Phinx\Seed\AbstractSeed;

class DefaultCurrenciesSeeder extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeders is available here:
     * https://book.cakephp.org/phinx/0/en/seeding.html
     */
    public function run()
    {
        $data = [
            [
                'code' => 'USD',
                'source' => 'open-exchange-rates',
                'value' => 0
            ],[
                'code' => 'BRL',
                'source' => 'open-exchange-rates',
                'value' => 0
            ],[
                'code' => 'EUR',
                'source' => 'open-exchange-rates',
                'value' => 0
            ],[
                'code' => 'BTC',
                'source' => 'open-exchange-rates',
                'value' => 0
            ],[
                'code' => 'ETH',
                'source' => 'open-exchange-rates',
                'value' => 0
            ]
        ];

        $posts = $this->table('currencies');
        $posts->insert($data)
            ->saveData();
    }
}
