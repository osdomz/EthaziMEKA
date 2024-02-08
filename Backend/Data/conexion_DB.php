<?php

namespace Data;
use PDO, PDOException;
require_once '../../Backend/Config/bd.php';

class conexion_DB {
    private $server = DB_HOST;
    private $dbname = DB_NAME;
    private $user = DB_USER;
    private $passw = DB_PASS;


    public function conectar()
    {

        try {
            $conexion = new PDO("mysql:host=$this->server; dbname=$this->dbname", $this->user, $this->passw);
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conexion;

        } catch (PDOException $e) {
            echo 'Error en la conexion ' . $e->getMessage();
        }
    }

    protected function consultar($sentencia){
        $sql = $this->conectar()->prepare($sentencia);
        return $sql;
    }


//TODO: Comprobar funcionamiento
    protected function insertar($datos, $tabla){
    try {
        
        $query = "INSERT INTO $tabla (";

        $c= 0;
        foreach($datos as $clave){
            if($c<=1){$query.=",";}
            $query.= $clave["campo_nombre"];
            $c++;
        }

        $query.= ") VALUES (";

        $c= 0;
        foreach($datos as $clave){
            if($c<=1){$query.=",";}
            $query.= $clave["campo_marcador"];
            $c++;
        }

        $query.= ")";

        $sql = $this->conectar()->prepare($query);

        
        foreach($datos as $clave){
           $sql->bindParam($clave["campo_marcador"], $clave["campo_valor"]);
        }

        $sql->execute();
        return $sql;
        
       
    } catch (PDOException $e) {
        echo 'Error al insertar datos: ' . $e->getMessage();
    }
}






//TODO: Comprobar funcionamiento
protected function actualizar($datos, $tabla, $condicion = "")
{
    try {
        // Construir la consulta UPDATE
        $setsStr = implode(', ', array_map(fn($campo) => "$campo = ?", array_keys($datos)));
        $sql = "UPDATE $tabla SET $setsStr";

        // Agregar la condición si se proporciona
        if ($condicion !== "") {
            $sql .= " WHERE $condicion";
        }

        // Preparar la consulta
        $stmt = $this->conectar()->prepare($sql);

        // Ejecutar la consulta
        $stmt->execute(array_values($datos));

        // Retornar el número de filas afectadas (0 si no se realizaron cambios)
        return $stmt->rowCount();
        
    } catch (PDOException $e) {
        // Manejar errores de la base de datos según sea necesario
        echo "Error al actualizar en la base de datos. Consulta: $sql. Mensaje de error: " . $e->getMessage();
    }
}

    
// Si vamos a utilizar GUEBS, esta función no nos sirve

//     protected function ejecutar($procedimiento){
//     try {
//         $conexion = $this->conectar();
//         $stmt = $conexion->prepare($procedimiento);

//         $stmt->execute();
//         return $stmt;
//     } catch (PDOException $e) {
//         echo 'Error al intentar ejecutar el procedimiento almacenado' . $e->getMessage();
//         return null;
//     }
// }
}


?>

