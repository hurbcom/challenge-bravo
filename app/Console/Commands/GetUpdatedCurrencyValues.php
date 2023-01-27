<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Http\Controllers\ConvertController;

class GetUpdatedCurrencyValues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:UpdateCurrencyValue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Este comando vai buscar os valores das moedas na API e atualiza-los a cada minuto';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(ConvertController $convertController)
    {
        $convertController->latestRates();
    }
}
