<?php

namespace Controladores;

use Exception;
use Modelos\parametrosModelo;

include '../../Backend/Modelos/parametrosModelo.php';

class parametrosControlador extends parametrosModelo {

    public function establecerInteresPrestamo($datos){



        $resul = $this->settearParametroInteresPrestamo($datos['interesPrestamo']);

        
        if($resul > 0){
            echo json_encode(["status" => "OK"]);
        }else{
            echo json_encode(["status" => "ERR"]);

        }
        
    }

    public function obtenerInteresPrestamo(){
        $resul = $this->recuperarInteresPrestamo();

        if($resul > 0){
            echo json_encode(["status" => "OK", "data" => $resul]);

        }else{
            echo json_encode(["status" => "ERR"]);

        }
    }
    
}


// En base al parametro pasado devuelve un metodo o otro
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $datosPeticion = json_decode(file_get_contents('php://input'), true);

    $datos = $datosPeticion['datos'];
    $metodo = $datosPeticion['metodo'];

    $controlador = new parametrosControlador();

    // Verificar si el método obtenido existe en el controlador
    if (method_exists($controlador, $metodo)) {

        $controlador->$metodo($datos);
    } else {
        // El método no existe en el controlador
        echo json_encode(['error' => 'Método no encontrado']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    //Como se trata de una peticion GET no va a recibir el objeto datos, solo el metodo

    $metodo = $_GET['metodo'];

    $controlador = new parametrosControlador();

    if (method_exists($controlador, $metodo)) {

        $controlador->$metodo();
    } else {
        // El método no existe en el controlador
        echo json_encode(['error' => 'Método no encontrado']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $metodo = $_GET['metodo'];
    $dato = $_GET['dato'];

    $controlador = new parametrosControlador();

    if (method_exists($controlador, $metodo)) {

        $controlador->$metodo($dato);
    } else {
        // El método no existe en el controlador
        echo json_encode(['error' => 'Método no encontrado']);
    }
}
