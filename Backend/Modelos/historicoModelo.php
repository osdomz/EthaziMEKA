<?php

namespace Modelos;

use Data\conexion_DB;
use PDO, PDOException, Exception;

include '../../Backend/Data/conexion_DB.php';

class historicoModelo extends conexion_DB
{

    protected function recuperarRegistrosHistoricos($idUsuario){
        $sql = $this->consultar("SELECT rh.* FROM registro_historico rh INNER JOIN usuarios u ON rh.id_usuario = u.id_usuario WHERE rh.id_usuario = :id_usuario");
    
        $sql->bindParam(':id_usuario', $idUsuario);
        $sql->execute();
    
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    
        return $resultados;
    }

    protected function recuperarTodosLosRegistros(){
        $sql = $this->consultar("SELECT US.usuario, RH.capitalPedido, RH.duracionPrestamo, RH.tipoPrestamo, RH.fecha_y_tiempo FROM registro_historico AS RH
        LEFT JOIN usuarios AS US ON US.id_usuario = RH.id_usuario");
    
        $sql->execute();
    
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    
        return $resultados;
    }

    protected function añadirNuevoRegistro($idUsuario, $capitalPedido, $duracionPrestamo, $tipoPrestamo, $fechaHora){

        $sql = "INSERT INTO registro_historico (id_usuario, capitalPedido, duracionPrestamo, tipoPrestamo, fecha_y_tiempo)
            VALUES (?, ?, ?, ?, ?)";
    
        $stmt = $this->consultar($sql);
    
        $stmt->bindValue(1, $idUsuario, PDO::PARAM_INT);
        $stmt->bindValue(2, $capitalPedido, PDO::PARAM_INT); // Asumiendo que capitalPedido es un entero, ajusta el tipo de parámetro según sea necesario
        $stmt->bindValue(3, $duracionPrestamo, PDO::PARAM_STR);
        $stmt->bindValue(4, $tipoPrestamo, PDO::PARAM_STR);
        $stmt->bindValue(5, $fechaHora, PDO::PARAM_STR); // Ajusta el tipo de parámetro según sea necesario
    
        $stmt->execute();

    
        if ($stmt->rowCount() > 0) {
            return true;
        } else {
            return false;
        }

      
    }


    protected function quitarRegistro($id){
        $sql = $this->consultar("DELETE FROM registro_historico WHERE id_registro = :id");

        $sql->bindParam(':id', $id, PDO::PARAM_INT);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        } else {
            return false;
        }

    }


}
