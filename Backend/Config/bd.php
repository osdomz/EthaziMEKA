<?php

namespace N00_Config;
//TODO: Moficiar ruta de produccion



if ($_SERVER['SERVER_NAME'] === 'localhost') {
    // Acceso desde localhost
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'banca');
    define('DB_USER', 'root');
    define('DB_PASS', '');
} else if ($_SERVER['SERVER_NAME'] === 'virtualcash.zerbitzaria.net'){
    // Otro servidor
    define('DB_HOST', 'virtualcash.zerbitzaria.net');
    define('DB_NAME', 'banca');
    define('DB_USER', 'root');
    define('DB_PASS', '');
}
