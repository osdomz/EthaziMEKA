angular.module('myApp', ['ngRoute', 'myApp.perfil', 'myApp.login', 'myApp.calculadora', 'myApp.admin'])



.controller("MainController", function ($scope, $rootScope, $location, $http, $route) {

    $scope.pageTitle = ""; // Inicializa pageTitle

    // Función para actualizar el título dinámico
    $scope.updateTitle = function() {
        // Obtén el título de la ruta actual
        var currentRoute = $route.current;
        if (currentRoute && currentRoute.$$route && currentRoute.$$route.title) {
            $scope.pageTitle = currentRoute.$$route.title;
        } else {
            $scope.pageTitle = "Título Predeterminado"; // Título predeterminado si no se encuentra ningún título específico para la ruta
        }
    };

    // Llama a la función para actualizar el título al cargar una nueva vista
    $scope.$on('$routeChangeSuccess', function() {
        $scope.updateTitle();
    })
    
   // Función para determinar si mostrar o no el header
$scope.showHeader = function() {
    // Aquí puedes agregar lógica adicional según tus necesidades
    return !($location.path() === '/login' || $location.path() === '/registro');
};

// Función para determinar si mostrar o no el footer
$scope.showFooter = function() {
    // Aquí puedes agregar lógica adicional según tus necesidades
    return !($location.path() === '/login' || $location.path() === '/registro');
};


    $http.get('../Backend/Controladores/usuarioControlador.php?metodo=usuarioEstaLogueado')
    .then(function(response) {
        
        if (!response.data.logueado) {
            $location.path('/login')
        } else{
            if($location.path() == '/login'){
                $location.path('/')

            }
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
   

});
