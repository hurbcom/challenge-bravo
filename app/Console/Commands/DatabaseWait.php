<?php

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DatabaseWait extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'database:wait';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Wait database fully up.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {
            $name = config('database.default');
            DB::connection($name)->select('SELECT 1');
            $this->info("Database is fully up ({$name})");

        } catch (Exception $exception) {

            $message = sprintf(
                'Waiting database is fully up. | %s %s',
                get_class($exception),
                $exception->getMessage()
            );

            $this->info($message);

            sleep(5);
            $this->handle();
        }
    }
}
