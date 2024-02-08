angular
  .module("myApp.perfil", [])
  .controller("PerfilController", function ($scope, $rootScope, $location, $http) {

    // Definir objeto de datos
    $scope.usuarioLogueado = {};
    $scope.usuarioLogueadoOriginal = {};

    // Recuperar id del usuario logueado
    let id_usuario = JSON.parse(localStorage.getItem('usuarioLogueado')).id_usuario;

    let paramPeticion = {
      datos: id_usuario,
      metodo: "obtenerDatosUsuario",
    };

    $http
      .post("../Backend/Controladores/usuarioControlador.php", paramPeticion)
      .then(function (response) {
        if (response.data.status == "OK") {
          $scope.usuarioLogueado.id = response.data.data[0]['id_usuario'];
          $scope.usuarioLogueado.nombre = response.data.data[0]['nombre'];
          $scope.usuarioLogueado.apellido = response.data.data[0]['apellido'];
          $scope.usuarioLogueado.email = response.data.data[0]['email'];
          $scope.usuarioLogueado.usuario = response.data.data[0]['usuario'];
          $scope.usuarioLogueado.contrasena = response.data.data[0]['contrasena'].substring(0, 8);

          // Guardar una copia del usuario original
          angular.copy($scope.usuarioLogueado, $scope.usuarioLogueadoOriginal);
        } 
      })
      .catch(function (error) {
        console.error("Error:", error);
      });

    // Función para guardar los cambios en el perfil
    $scope.actualizarDatos = function () {
      // Verificar si ha habido cambios
      if (angular.equals($scope.usuarioLogueado, $scope.usuarioLogueadoOriginal)) {
        alert("No se han realizado cambios en el perfil");
        return; // Evitar enviar la solicitud al servidor
      }

      // Actualiza el usuarioLogueado en el servidor
      let paramPeticion = {
        datos: {
          id: $scope.usuarioLogueado.id,
          nombre: $scope.usuarioLogueado.nombre,
          apellido: $scope.usuarioLogueado.apellido,
          email: $scope.usuarioLogueado.email,
          usuario: $scope.usuarioLogueado.usuario,
          contrasena: $scope.usuarioLogueado.contrasena
        },
        metodo: "actualizarPerfil",
      };

      $http
        .post("../Backend/Controladores/usuarioControlador.php", paramPeticion)
        .then(function (response) {
          if (response.data.estadoActualizacion == "OK") {
            alert("Perfil actualizado correctamente")
          } else {
            alert("Error al actualizar el perfil")
          }
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
    };

    $scope.eliminarCuenta = function(){
      // Obtener id del usuario actual

      // Eliminar la cuenta de BD
      $http
        .delete(
          "../Backend/Controladores/usuarioControlador.php?metodo=eliminarUsuario&dato=" + id_usuario
        )
        .then(function (response) {
          if (response.data.status == "OK") {
            // Solicitar confirmación antes de eliminar la cuenta
            if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
              alert("Usuario eliminado");
              $location.path("/login");
            } 
          } else {
            alert("Error al eliminar el usuario");
          }
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
    };
  });
