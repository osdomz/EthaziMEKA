angular.module("myApp.admin", [])

    .controller("AdminController", function ($scope, $http) {

        $scope.nombreAdmin = JSON.parse(localStorage.getItem('usuarioLogueado')).nombre
        $scope.datosUsuarios = {}
        $scope.datosCalculos = {}

        $scope.valorInteres = 0; 


        //Llamar al servidor para coger el dato del interes
        $http
        .get("../Backend/Controladores/parametrosControlador.php?metodo=obtenerInteresPrestamo")
        .then(function (response) {


          if(response.data.status == 'OK'){
              $scope.valorInteres = (response.data.data * 100) + "%"

          }
        

        })
        .catch(function (error) {
            console.error("Error:", error);
        });
        //Llamar al servidor para coger datos de calculos
        $http
            .get("../Backend/Controladores/historicoControlador.php?metodo=obtenerRegistrosAll")
            .then(function (response) {

                $scope.datosCalculos = response.data

            })
            .catch(function (error) {
                console.error("Error:", error);
            });


        //Llamar al servidor para coger datos de usuarios
        $http
            .get("../Backend/Controladores/usuarioControlador.php?metodo=recuperarUsuariosAll")
            .then(function (response) {

                $scope.datosUsuarios = response.data
            })
            .catch(function (error) {
                console.error("Error:", error);
            });


        $scope.cambiarInteres = function(){

            //Convertir el numero en formato adecuado

            if ($scope.valorInteres.toString().includes(',')) {
              alert("Por favor, utiliza un punto en lugar de una coma para los decimales.");
              return;
          }
            let porcentaje = $scope.valorInteres/100;


            let paramPeticion = {
                datos: {
                  interesPrestamo: porcentaje
                },
                metodo: "establecerInteresPrestamo",
              };
      
              $http
                .post("../Backend/Controladores/parametrosControlador.php", paramPeticion)
                .then(function (response) {
                  if (response.data.status == "OK") {
                    
                      alert("Has modificado el interes del prestamo")

                      window.location.reload();
                    } else {
                    $scope.mensaje = "Error al actualizar el interes";
                  }
                })
                .catch(function (error) {
                  console.error("Error:", error);
                });


        }

        
    })

