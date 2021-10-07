<?php

declare(strict_types=1);

namespace App;

use PDO;
use Phinx\Config\Config;
use Phinx\Migration\Manager;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\NullOutput;

class Connection extends PDO
{
    public function __construct()
    {
        $env = $_ENV + $_SERVER;
        $testingEnvironment = !empty($env['APP_ENV']) && $env['APP_ENV'] === 'testing';

        if ($testingEnvironment) {
            parent::__construct('sqlite::memory:', null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);

            $this->runPhinxOnPhpUnit();
        } else {
            $path = realpath(__DIR__ . '/../storage/db.sqlite3');
            parent::__construct("sqlite:$path", null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
        }
    }

    private function runPhinxOnPhpUnit()
    {
        $configArray = require(__DIR__ . '/../phinx.php');
        $configArray['environments']['testing']['connection'] = $this;
        $config = new Config($configArray);
        $manager = new Manager($config, new StringInput(' '), new NullOutput());
        $manager->migrate('testing');
        $manager->seed('testing');

        // You can change default fetch mode after the seeding
        $this->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    }
}
