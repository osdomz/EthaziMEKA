<?php

namespace Modelos;

use Data\conexion_DB;
use PDO, PDOException, Exception;

include '../../Backend/Data/conexion_DB.php';

class usuarioModelo extends conexion_DB
{

    //     
    protected function comprobarUsuario($usuarioOemail, $contraseña)
{
    // Consultar la base de datos para obtener el usuario
    $sql = $this->consultar("SELECT * FROM usuarios WHERE (usuario = :usuarioOemail OR email = :usuarioOemail)");
    $sql->bindParam(':usuarioOemail', $usuarioOemail);
    $sql->execute();

    // Obtener los resultados de la consulta
    $usuario = $sql->fetch(PDO::FETCH_ASSOC);

    // Verificar si se encontró un usuario
    if ($usuario) {
        // Verificar la contraseña hasheada utilizando password_verify()
        if (password_verify($contraseña, $usuario['contrasena'])) {
            // La contraseña es correcta, devuelve el usuario
            return $usuario;
        } else {
            // La contraseña no coincide, devuelve falso
            return false;
        }
    } else {
        // No se encontró ningún usuario con el nombre de usuario o correo electrónico proporcionado
        return false;
    }
}


protected function insertarUsuario($datos)
{
    try {
        // Verificar si el usuario ya existe
        $usuarioExistente = $this->comprobarUsuarioExistente($datos['usuario'], $datos['email']);

        if ($usuarioExistente) {
            // Si el usuario ya existe, devolver un código de error
            return -1;
        }

        // Hashear la contraseña
        $datos['contrasena'] = password_hash($datos['contrasena'], PASSWORD_DEFAULT);

        // Construir la consulta SQL
        $campos = implode(', ', array_keys($datos));
        $marcadores = ':' . implode(', :', array_keys($datos));
        $query = "INSERT INTO usuarios ($campos) VALUES ($marcadores)";

        // Preparar y ejecutar la consulta
        $stmt = $this->conectar()->prepare($query);
        foreach ($datos as $campo => $valor) {
            $stmt->bindValue(":$campo", $valor);
        }
        $stmt->execute();

        // Devolver el número de filas afectadas
        return $stmt->rowCount();
    } catch (PDOException $e) {
        echo 'Error al insertar datos: ' . $e->getMessage();
        return 0;
    }
}

    public function comprobarUsuarioExistente($usuario, $email)
    {
        $sql = $this->consultar("SELECT COUNT(*) FROM usuarios WHERE usuario = :usuario OR email = :email");
        $sql->bindParam(':usuario', $usuario);
        $sql->bindParam(':email', $email);
        $sql->execute();
    
        $resultados = $sql->fetchColumn();
        return $resultados > 0;
    }


    public function actualizarUsuario($datosUsuario)
    {
        try {
            // Si la contraseña no está vacía, hashearla antes de actualizar
            if (!empty($datosUsuario['contrasena'])) {
                $datosUsuario['contrasena'] = password_hash($datosUsuario['contrasena'], PASSWORD_DEFAULT);
            }
    
            $query = "UPDATE usuarios SET
                      nombre = :nombre,
                      apellido = :apellido,
                      usuario = :usuario,
                      email = :email";
            
            // Si la contraseña no está vacía, incluirla en la actualización
            if (!empty($datosUsuario['contrasena'])) {
                $query .= ", contrasena = :contrasena";
            }
    
            $query .= " WHERE id_usuario = :id_usuario";
    
            $stmt = $this->conectar()->prepare($query);
    
            // Vincular los valores a los marcadores de posición
            $stmt->bindParam(':nombre', $datosUsuario['nombre']);
            $stmt->bindParam(':apellido', $datosUsuario['apellido']);
            $stmt->bindParam(':usuario', $datosUsuario['usuario']);
            $stmt->bindParam(':email', $datosUsuario['email']);
            $stmt->bindParam(':id_usuario', $datosUsuario['id']);
            
            // Si la contraseña no está vacía, vincularla también
            if (!empty($datosUsuario['contrasena'])) {
                $stmt->bindParam(':contrasena', $datosUsuario['contrasena']);
            }
    
            // Ejecutar la consulta preparada
            $stmt->execute();
    
            // Devolver la cantidad de filas afectadas
            return $stmt->rowCount();
        } catch (PDOException $e) {
            echo 'Error al modificar el usuario: ' . $e->getMessage();
            return 0;
        }
    }
    

    public function modificarDatosUsuario($datos)
    {
        $setClause = implode(', ', array_map(fn ($campo) => "$campo = :$campo", array_keys($datos)));

        $query = "UPDATE usuarios SET $setClause WHERE id = :id";
        $stmt = $this->conectar()->prepare($query);

        foreach ($datos as $campo => $valor) {
            $stmt->bindValue(":$campo", $valor);
        }

        $stmt->execute();

        return $stmt->rowCount();
    }

    public function obtenerConexion()
    {
        return $this->conectar();
    }


    public function consultarUsuarios()
    {
        $sql = $this->consultar("SELECT * FROM usuarios");
        $sql->execute();

        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }




    public function borrarUsuario($id)
{


    try {
        $sql = "DELETE FROM usuarios WHERE id_usuario = :id";
        $query = $this->conectar()->prepare($sql);
        $query->bindParam(':id', $id, PDO::PARAM_INT);
        $result = $query->execute();


        return $result;
    } catch (PDOException $e) {
        // Manejar la excepción aquí si es necesario
        echo "Error al borrar usuario: " . $e->getMessage();
        return false;
    }
}


    public function recuperarDatosUsuarioEspecifico($id) {
    $sql = $this->consultar("SELECT * FROM usuarios WHERE id_usuario = :id");
    $sql->bindParam(':id', $id);
    $sql->execute();

    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);


    return $resultados;
}


}
