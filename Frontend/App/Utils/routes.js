angular.module('myApp')

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../../../Frontend/Vistas/calculadora.html',
            controller: 'CalculadoraController',
            title: 'Calculadora'
        })
        .when('/perfil', {
            templateUrl: '../../../Frontend/Vistas/perfil.html',
            controller: 'PerfilController',
            title: 'Perfil'
        })
        .when('/login', {
            templateUrl: '../../../Frontend/Vistas/login.html',
            controller: 'LoginController',
            title: 'Login'
        })
        .when('/registro', {
            templateUrl: '../../../Frontend/Vistas/registro.html',
            controller: 'LoginController',
            title: 'Registro'
        })
        .when('/admin', {
            templateUrl: '../../../Frontend/Vistas/admin.html',
            controller: 'AdminController',
            title : 'Administracion'
        })
        .otherwise({
            //TODO: Solo se manda al 404 cuando no se reconoce el primer / , si se le pasan dos /uno/dos se rompe
            templateUrl: '../../../Frontend/App/Componentes/404.html'
        });

    // Verificar si el navegador admite HTML5 mode y si pushState está disponible
    if (window.history && window.history.pushState) {
        // $locationProvider.html5Mode(true); causará un error si no se establece la etiqueta <base>
        // Puedes habilitar HTML5 mode y establecer requireBase en false
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
});
