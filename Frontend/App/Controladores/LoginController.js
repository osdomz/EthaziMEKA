angular
  .module("myApp.login", [])
  .controller("LoginController", function ($scope, $http, $location, $rootScope) {
    $scope.usuario = {};
    $scope.mensaje = "";

    $scope.admin = false;
    // Al intentar cargar la página, verifica si hay datos del usuario almacenados en localStorage
    var storedUser = localStorage.getItem('usuarioLogueado');

    if (storedUser) {
      $rootScope.usuarioLogueado = JSON.parse(storedUser);

      if($rootScope.usuarioLogueado.rol == 1){
        $scope.admin = true
  
      }
    }


  
    $scope.login = function () {
      if ($scope.usuario.correo && $scope.usuario.contrasena) {
        let paramPeticion = {
          datos: {
            usuarioOEmail: $scope.usuario.correo,
            contrasena: $scope.usuario.contrasena,
          },
          metodo: "autenticarUsuario",
        };

        $http
          .post("../Backend/Controladores/usuarioControlador.php", paramPeticion)
          .then(function (response) {
            if (response.data.estadoLogin == "OK") {
              $rootScope.usuarioLogueado = response.data.usuario;

              // Almacena los datos del usuario en localStorage
              localStorage.setItem('usuarioLogueado', JSON.stringify($rootScope.usuarioLogueado));

              //Obtener el id de usuario y tratarlo
             
              if ($rootScope.usuarioLogueado.rol === 1) {
                //Usuario admin
                $location.path("/admin");
                $scope.admin = true
              } else {
                $location.path("/");
              }
            } else {
              $scope.mensaje = "Usuario o contraseña no válidos";
            }
          })
          .catch(function (error) {
            console.error("Error:", error);
          });
      } else {
        $scope.mensaje = "Por favor, rellena los campos";
      }
    };



    $scope.registrarse = function () {
      // Validación de campos obligatorios
      if (
        !$scope.nombre ||
        !$scope.apellido ||
        !$scope.usuarios ||
        !$scope.email ||
        !$scope.contrasena ||
        !$scope.validarcontrasena
      ) {
        $scope.mensaje = "Por favor, rellena todos los campos.";
        return;
      }

      // Validación de que las contraseñas coincidan
      if ($scope.contrasena !== $scope.validarcontrasena) {
        $scope.mensaje = "Las contraseñas no coinciden. Asegúrate de que ambas contraseñas sean iguales.";
        return;
      }

      // Si llegamos aquí, todos los campos están llenos y las contraseñas coinciden
      let contrasenaAEnviar = $scope.contrasena; // Puedes elegir enviar $scope.validarcontrasena si lo prefieres

      let datosUsuario = {
        nombre: $scope.nombre,
        apellido: $scope.apellido,
        usuario: $scope.usuarios,
        email: $scope.email,
        contrasena: contrasenaAEnviar,
      };

      let paramPeticion = {
        datos: datosUsuario,
        metodo: "procesarRegistro",
      };

      $http
        .post(
          "../Backend/Controladores/usuarioControlador.php",
          paramPeticion
        )
        .then(function (response) {
          if (response.data.estadoRegistro == "OK") {
            //INFO: Hay que darle algo de tiempo despues de aceptar el alert
            alert("Te has registrado correctamente");
            setTimeout(function () {
              $location.path("/login");
              $scope.$apply();
            }, 200);
          } else if (response.data.estadoRegistro == "UsuarioExiste") {
            $scope.mensaje = "El usuario ya existe, vuelve a intentarlo.";

          } else {
            $scope.mensaje = "Error en el registro. Inténtalo de nuevo.";

          }
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
    };



    // Redirige a la página de registro al hacer clic en el botón "Registrarse"
    $scope.irAlRegistro = function () {
      $location.path("/registro");
    };

    $scope.irAlLogin = function () {
      $location.path("/login");
    };


    $scope.cerrarSesion = function () {
      //Peticion DELETE para destruir la sesion actual
      $http
        .delete(
          "../Backend/Controladores/usuarioControlador.php?metodo=desloguearUsuario"
        )
        .then(function (response) {
          if (response.data.status == "OK") {

            //Si se recibe confirmacion de la eliminacion de la sesion se recarga la pagina para que coja la logica de validacion
            window.location.reload();
          }
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
    };
  }
  );
