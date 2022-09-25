<?php

namespace App\Console;

use App\Adapter\Repository\ShowCurrenciesAdatperRepository;
use App\Adapter\Apis\ExchangeRatePopulationApiAdapter;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $exchangeRatePopulationApi = new ExchangeRatePopulationApiAdapter();
            $getCurrencies = new ShowCurrenciesAdatperRepository();

            $currencies = $getCurrencies->getAll();

            foreach ($currencies as $currency) {
                $exchangeRatePopulationApi->execute($currency);

                # Due to Api restrictions (only one request in free plan).
                sleep(1);
            }
        })
        ->everyFiveMinutes();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
