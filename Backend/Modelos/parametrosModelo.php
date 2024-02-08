<?php

namespace Modelos;

use Data\conexion_DB;
use PDO, PDOException, Exception;

include '../../Backend/Data/conexion_DB.php';

class parametrosModelo extends conexion_DB
{

    protected function settearParametroInteresPrestamo($newInteres){

        $query = "UPDATE param_prestamo SET InteresPrestamo = :nInteres";
        $stmt = $this->conectar()->prepare($query);

        $stmt->bindValue(":nInteres", $newInteres);

        $stmt->execute();

        return $stmt->rowCount();
    }     
    


    protected function recuperarInteresPrestamo(){
        $sql = $this->consultar("SELECT InteresPrestamo FROM param_prestamo");
        $sql->execute();

        $resultados = $sql->fetch(PDO::FETCH_ASSOC);

        return $resultados['InteresPrestamo'];
    }

}
