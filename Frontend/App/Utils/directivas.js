angular.module('myApp')  // Usa angular.module para obtener una referencia al módulo existente
.directive('headerDirective', function() {
    return {
        restrict: 'E',
        templateUrl: '../../../Frontend/App/Componentes/header.html',
    };
})
.directive('footerDirective', function() {
    return {
        restrict: 'E',
        templateUrl: '../../../Frontend/App/Componentes/footer.html',
    };

})

