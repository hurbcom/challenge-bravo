<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DatabaseTesting extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'database:testing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prepare database testing.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('Creating database for tests.');

        DB::connection()->statement('DROP DATABASE IF EXISTS `hurb_testing`');
        DB::connection()->statement('CREATE DATABASE `hurb_testing`');
    }
}