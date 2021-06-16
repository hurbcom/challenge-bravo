<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tb_users')->insert([
            'name' => "Aurélio Moreira",
            'email' => "aurelio@hurb.com.br",
            'password' => "euvoucontrataroaurelio",
        ]);
    }
}
