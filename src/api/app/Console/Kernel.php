<?php

namespace Hurb\Api\Console;

use Hurb\CurrencyConverter\Frameworks\Lumen\RateProviderCacheCommand;
use Illuminate\Console\Scheduling\Schedule;
use Laravel\Lumen\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Registered Commands for console usage
     *
     * @var array
     */
    protected $commands = [
        RateProviderCacheCommand::class
    ];

    /**
     * Scheduled Commands
     *
     * @param  Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command(RateProviderCacheCommand::class)->everyMinute();
    }
}
