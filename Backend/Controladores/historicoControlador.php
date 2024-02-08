<?php

namespace Controladores;

use Exception;
use Modelos\historicoModelo;

include '../../Backend/Modelos/historicoModelo.php';

class historicoControlador extends historicoModelo{

    public function obtenerRegistros($datos){

        $resul = $this->recuperarRegistrosHistoricos($datos['idUsuario']);

        if(count($resul) > 0){
            echo json_encode($resul);
        }

    
    }


    public function obtenerRegistrosAll(){

        $resul = $this->recuperarTodosLosRegistros();

        if(count($resul) > 0){
            echo json_encode($resul);
        }

    }


    public function insertarRegistro($datos){
    
        if (!$this->añadirNuevoRegistro($datos['idUsuario'], $datos['importe'], $datos['duracion'], $datos['tipo'], $datos['fecha'])) {
            // Si ocurre un error al insertar el registro, devuelve false inmediatamente
            return false;
        }
      
    
        // Si todos los registros se insertan correctamente, devuelve true
        return true;
    }


    public function eliminarRegistro($dato){
        if($this->quitarRegistro($dato)){
            return true;
        }else{
            return false;
        }
    }
}


// En base al parametro pasado devuelve un metodo o otro
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $datosPeticion = json_decode(file_get_contents('php://input'), true);

    $datos = $datosPeticion['datos'];
    $metodo = $datosPeticion['metodo'];

    $controlador = new historicoControlador();

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

    $controlador = new historicoControlador();

    if (method_exists($controlador, $metodo)) {

        $controlador->$metodo();
    } else {
        // El método no existe en el controlador
        echo json_encode(['error' => 'Método no encontrado']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $metodo = $_GET['metodo'];
    $dato = $_GET['dato'];

    $controlador = new historicoControlador();

    if (method_exists($controlador, $metodo)) {

        $controlador->$metodo($dato);
    } else {
        // El método no existe en el controlador
        echo json_encode(['error' => 'Método no encontrado']);
    }
}
