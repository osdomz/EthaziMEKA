<?php

namespace Controladores;

use Exception;
use Modelos\usuarioModelo;

include '../../Backend/Modelos/usuarioModelo.php';

session_start();

class usuarioControlador extends usuarioModelo
{
    public function autenticarUsuario($datos)
    {
        $usuarioValido = $this->comprobarUsuario($datos['usuarioOEmail'], $datos['contrasena']);
    
        if ($usuarioValido) {
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
        
            $_SESSION['logueado'] = true;
            $_SESSION['id_usuario'] = $usuarioValido['id_usuario'];
        
            echo json_encode(['estadoLogin' => 'OK', 'usuario' => $usuarioValido]);
        } else {
            echo json_encode(['estadoLogin' => 'NotOk']);
        }
        
    }
    

    public function procesarRegistro($datos)
    {
        if (!empty($datos)) {
            // Asegúrate de que el campo 'rol' se establezca siempre a 2 antes de insertar el usuario
            $datos['rol'] = 2;

            $estado = $this->insertarUsuario($datos);

            if ($estado > 0) {
                $response = ["estadoRegistro" => "OK"];
            } else if($estado = -1){
                $response = ["estadoRegistro" => "UsuarioExiste"];
            }else{
                $response = ["estadoRegistro" => "Error"];

            }
        } else {
            $response = ["estadoRegistro" => "Error", "mensaje" => "Datos de registro no proporcionados"];
        }

        echo json_encode($response);
    }

    public function actualizarPerfil($datosUsuario)
{
    
    // Realizar la actualización en la base de datos
    $estado = $this->actualizarUsuario($datosUsuario);

    if ($estado > 0) {
        echo json_encode(['estadoActualizacion' => 'OK']);
    } else {
        echo json_encode(['estadoActualizacion' => 'Error']);
    }
}


    public function usuarioEstaLogueado()
    {
        $logueado = isset($_SESSION['logueado']) ? $_SESSION['logueado'] : false;
        echo json_encode(['logueado' => $logueado]);
    }

    public function desloguearUsuario()
    {
        try {
            session_destroy();
            echo json_encode(['status' => 'OK']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'ERR']);
        }
    }


    public function eliminarUsuario($id){

        if( $this->borrarUsuario($id)){
            echo json_encode(['status' => 'OK']);
        }else{
            echo json_encode(['status' => 'ERR']);
        }
    }

    public function obtenerDatosUsuario($id){

        $resul = $this->recuperarDatosUsuarioEspecifico($id);

        if($resul){
             echo json_encode(['status' => 'OK', 'data' => $resul]);

         }
    }


    public function recuperarUsuariosAll(){

        $resul = $this->consultarUsuarios();

        if(count($resul) > 0){
            echo json_encode($resul);
        }
    }

}

// En base al parametro pasado devuelve un metodo o otro
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $datosPeticion = json_decode(file_get_contents('php://input'), true);

    $datos = $datosPeticion['datos'];
    $metodo = $datosPeticion['metodo'];

    $controlador = new usuarioControlador();

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

    $controlador = new usuarioControlador();

    if (method_exists($controlador, $metodo)) {

        $controlador->$metodo();
    } else {
        // El método no existe en el controlador
        echo json_encode(['error' => 'Método no encontrado']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $metodo = $_GET['metodo'];
    $dato = isset($_GET['dato']) ? $_GET['dato'] : "";

    $controlador = new usuarioControlador();

    if (method_exists($controlador, $metodo)) {

        if($dato != ""){
            $controlador->$metodo($dato);
        }else{
            $controlador->$metodo();

        }
    } else {
        // El método no existe en el controlador
        echo json_encode(['error' => 'Método no encontrado']);
    }
}
