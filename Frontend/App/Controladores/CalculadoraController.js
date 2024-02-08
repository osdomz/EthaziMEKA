angular
  .module("myApp.calculadora", [])
  .controller("CalculadoraController", function ($scope, $sce, $http) {
    $scope.cuotaType = "Cuota anual";
    $scope.sliderValue = 125000;
    $scope.maxDuracionPrestamo = 10;
    $scope.duracionPrestamo = $scope.maxDuracionPrestamo / 2;
    $scope.tituloPrestamo = "Préstamo Americano";
    $scope.tipoPrestamo = "A";
    $scope.totalAnualidad = 0;
    $scope.totalInteres = 0;
    $scope.registrosCalculados = [];
    $scope.mensaje = "";

    $scope.interesPrestamo = 0;
    $scope.interesPrestamoPorcentaje = 0;



    //Llamar a base de datos para obtener el interes del prestamo
    $http
    .get("../Backend/Controladores/parametrosControlador.php?metodo=obtenerInteresPrestamo")
    .then(function (response) {


      if(response.data.status == 'OK'){
          $scope.interesPrestamo = response.data.data
          $scope.interesPrestamoPorcentaje = ($scope.interesPrestamo * 100) + "%";

      }
    

    })
    .catch(function (error) {
        console.error("Error:", error);
    });
  
    //Rellenar objeto de registros desde base de datos
    let paramPeticion = {
      datos: {
        idUsuario: JSON.parse(localStorage.getItem('usuarioLogueado')).id_usuario
      },
      metodo: "obtenerRegistros",
    };

    $http
      .post("../Backend/Controladores/historicoControlador.php", paramPeticion)
      .then(function (response) {

        response.data.forEach(function (registro) {
          $scope.registrosCalculados.push({
            id:registro.id_registro,
            importe: registro.capitalPedido,
            duracion: registro.duracionPrestamo,
            tipo: registro.tipoPrestamo,
            fecha: new Date(registro.fecha_y_tiempo) // Asegúrate de que el formato de fecha sea compatible
          });
        });
      })
      .catch(function (error) {
        console.error("Error:", error);
      });

    $scope.$watch("cuotaType", function (newVal, oldVal) {
      if (newVal !== oldVal) {
        switch (newVal) {
          case "Cuota anual":
            $scope.maxDuracionPrestamo = 10; // Máximo de 10 años
            break;
          case "Cuota semestral":
            $scope.maxDuracionPrestamo = 20; // Máximo de 20 semestres
            break;
          default:
            $scope.maxDuracionPrestamo = 180; // Valor predeterminado
        }
        $scope.duracionPrestamo = $scope.maxDuracionPrestamo / 2; // Calcular la mitad del valor máximo
      }
    });

    $scope.borrarRegistro = function(id) {
      // Eliminar del objeto usado en el frontend
      var indexOfRecord = $scope.registrosCalculados.findIndex(function(registro) {
          return registro.id === id;
      });
  
      if (indexOfRecord !== -1) {
          // Eliminar del objeto usado en el frontend
          $scope.registrosCalculados.splice(indexOfRecord, 1);
  
          // Eliminar en base de datos
          $http
              .delete("../Backend/Controladores/historicoControlador.php?metodo=eliminarRegistro&dato=" + id)
              .then(function(response) {
              })
              .catch(function(error) {
                  console.error("Error:", error);
              });
      } else {
          console.log("No se encontró el registro con el id proporcionado");
      }
  };
    $scope.incrementarImporte = function () {
      $scope.sliderValue += 5000;
    };

    $scope.decrementarImporte = function () {
      if ($scope.sliderValue >= 5000) {
        $scope.sliderValue -= 5000;
      }
    };

    $scope.incrementarDuracion = function () {
      if ($scope.duracionPrestamo < $scope.maxDuracionPrestamo) {
        $scope.duracionPrestamo += 1;
      }
    };

    $scope.decrementarDuracion = function () {
      if ($scope.duracionPrestamo > 0) {
        $scope.duracionPrestamo -= 1;
      }
    };

    $scope.handleBtnClick = function (btnTipo) {
      $scope.tipoPrestamo = btnTipo;

      if ($scope.tipoPrestamo == "A") {
        $scope.cuotaType = "Cuota anual";
      }
      $scope.tituloPrestamo = $scope.obtenerTituloPrestamo(btnTipo);
    };

    $scope.obtenerTituloPrestamo = function (tipoPrestamo) {
      switch (tipoPrestamo) {
        case "A":
          return "Préstamo Americano";
        case "F":
          return "Préstamo Francés";
        case "L":
          return "Préstamo Lineal";
        default:
          return "Tipo de préstamo desconocido";
      }
    };

    $scope.calcularPrestamo = function () {

      $scope.tablaPrestamo = [];
      $scope.totalAnualidad = 0;
      $scope.totalInteres = 0;


      //Validar que el importe y tiempo no sean 0
      if($scope.sliderValue == 0 || $scope.duracionPrestamo == 0){
        $scope.mensaje = "Valores incorrectos. El importe y la duracion deben ser mayores a 0 "
        return;
      }

      if ($scope.tipoPrestamo == "A") {
        //PRESTAMO AMERICANO


        // Calcular la cuota de interés y la cuota amortizada
        var interesAnual = $scope.sliderValue * $scope.interesPrestamo;
        var cuotaInteres = interesAnual;
        var cuotaAmortizada = 0;

        // Inicializar el saldo principal
        var saldoPrincipal = $scope.sliderValue;

        // Agregar el valor inicial al array de resultados (año 0)
        $scope.tablaPrestamo.push({
          intervalo: 0,
          mensualidad: 0,
          cuotaInteres: 0,
          cuotaAmortizada: 0,
          totalAmortizado: 0,
          capitalPendiente: saldoPrincipal,
        });

        // Calcular los valores para cada período
        for (var i = 1; i <= $scope.duracionPrestamo; i++) {
          // Calcular la mensualidad sumando la cuota de interés y la cuota amortizada

          var mensualidad = cuotaInteres + cuotaAmortizada;
          $scope.totalInteres += mensualidad;
          // Calcular el total amortizado sumando la cuota amortizada de este período con la acumulada de períodos anteriores
          var totalAmortizado =
            cuotaAmortizada +
            (i > 1 ? $scope.tablaPrestamo[i - 1].totalAmortizado : 0);

          // Calcular el capital pendiente restando el total amortizado del saldo principal inicial
          var capitalPendiente = $scope.sliderValue - totalAmortizado;

          // Agregar los valores al array de resultados
          $scope.tablaPrestamo.push({
            intervalo: i,
            mensualidad: mensualidad,
            cuotaInteres: cuotaInteres,
            cuotaAmortizada: cuotaAmortizada,
            totalAmortizado: totalAmortizado,
            capitalPendiente: capitalPendiente,
          });

          // Actualizar el saldo principal restando la cuota amortizada
          saldoPrincipal -= cuotaAmortizada;

          // Actualizar la cuota amortizada si es el último año
          if (i === $scope.duracionPrestamo) {
            cuotaAmortizada = saldoPrincipal;
            // Actualizar el total amortizado
            totalAmortizado += cuotaAmortizada;
            // Actualizar el capital pendiente a 0
            capitalPendiente = 0;

            // Actualizar el último elemento del array de resultados
            $scope.tablaPrestamo[i] = {
              intervalo: i,
              mensualidad: saldoPrincipal + cuotaInteres, // Anualidad igual al capital inicial más la cuota de interés
              cuotaInteres: cuotaInteres,
              cuotaAmortizada: cuotaAmortizada,
              totalAmortizado: $scope.sliderValue,
              capitalPendiente: 0,
            };
          }
        }

        $scope.totalAnualidad = $scope.tablaPrestamo.reduce(function (
          total,
          periodo
        ) {
          return total + periodo.mensualidad;
        },
          0);
      } else if ($scope.tipoPrestamo == "F") {
        //PRESTAMO FRANCES

        // Calcular anualidad/semestralidad
        let tasaCambio = ((1 - Math.pow((1 + $scope.interesPrestamo), -1 * $scope.duracionPrestamo)) / $scope.interesPrestamo).toFixed(2);
        let pagoRecurrente = ($scope.sliderValue / tasaCambio).toFixed(2);

        // Inicializar el saldo principal
        let saldoPrincipal = $scope.sliderValue;

        // Inicializar el total amortizado
        let totalAmortizado = 0;

        // Agregar el valor inicial al array de resultados (año 0)
        $scope.tablaPrestamo.push({
          intervalo: 0,
          mensualidad: 0,
          cuotaInteres: 0,
          cuotaAmortizada: 0,
          totalAmortizado: 0,
          capitalPendiente: parseFloat(saldoPrincipal.toFixed(2)), // Convertir a número con dos decimales redondeados
        });

        for (var i = 1; i <= $scope.duracionPrestamo; i++) {
          // Calcular la cuota de interés
          let cuotaInteres = ($scope.interesPrestamo * saldoPrincipal).toFixed(2); // Redondear a dos decimales

          // Calcular la cuota amortizada
          let cuotaAmortizada = (pagoRecurrente - cuotaInteres).toFixed(2); // Redondear a dos decimales

          // Incrementar el total amortizado
          totalAmortizado += parseFloat(cuotaAmortizada); // Convertir a número antes de sumar

          // Calcular el capital pendiente
          saldoPrincipal -= parseFloat(cuotaAmortizada); // Convertir a número antes de restar

          // Agregar los valores al array de resultados
          $scope.tablaPrestamo.push({
            intervalo: i,
            mensualidad: parseFloat(pagoRecurrente), // Convertir a número con dos decimales redondeados
            cuotaInteres: parseFloat(cuotaInteres), // Convertir a número con dos decimales redondeados
            cuotaAmortizada: parseFloat(cuotaAmortizada), // Convertir a número con dos decimales redondeados
            totalAmortizado: parseFloat(totalAmortizado.toFixed(2)), // Convertir a número con dos decimales redondeados
            capitalPendiente: parseFloat(i === $scope.duracionPrestamo ? "0.00" : saldoPrincipal.toFixed(2)), // Convertir a número con dos decimales redondeados y establecer a 0 en el último intervalo
          });
        }



        // Calcular el totalAnualidad y el totalInteres sumando los valores correspondientes de la tabla de amortización
        for (var i = 1; i <= $scope.duracionPrestamo; i++) {
          $scope.totalAnualidad += parseFloat($scope.tablaPrestamo[i].mensualidad);
          $scope.totalInteres += parseFloat($scope.tablaPrestamo[i].cuotaInteres);
        }

        // Redondear los totales a dos decimales
        $scope.totalAnualidad = $scope.totalAnualidad.toFixed(2);
        $scope.totalInteres = $scope.totalInteres.toFixed(2);

      } else {
        //PRESTAMO LINEAL

        // Calcular la cuota constante de amortización
        var cuotaAmortizacion = $scope.sliderValue / $scope.duracionPrestamo;

        // Inicializar el saldo principal
        var saldoPrincipal = $scope.sliderValue;

        // Agregar el valor inicial al array de resultados (año 0)
        $scope.tablaPrestamo.push({
          intervalo: 0,
          mensualidad: 0,
          cuotaInteres: 0,
          cuotaAmortizada: 0,
          totalAmortizado: 0,
          capitalPendiente: saldoPrincipal,
        });

        // Calcular los valores para cada período
        for (var i = 1; i <= $scope.duracionPrestamo; i++) {
          // Calcular la cuota de interés
          var cuotaInteres = ($scope.interesPrestamo * saldoPrincipal).toFixed(2); // Suponiendo una tasa de interés del 5%

          // Calcular el capital pendiente después de pagar la cuota de amortización
          saldoPrincipal -= cuotaAmortizacion;

          // Agregar los valores al array de resultados
          $scope.tablaPrestamo.push({
            intervalo: i,
            mensualidad: (parseFloat(cuotaInteres) + parseFloat(cuotaAmortizacion)).toFixed(2),
            cuotaInteres: parseFloat(cuotaInteres),
            cuotaAmortizada: parseFloat(cuotaAmortizacion),
            totalAmortizado: ($scope.sliderValue - saldoPrincipal).toFixed(2),
            capitalPendiente: saldoPrincipal.toFixed(2),
          });
        }

        // Calcular el totalAnualidad y el totalInteres sumando los valores correspondientes de la tabla de amortización
        for (var i = 1; i <= $scope.duracionPrestamo; i++) {
          $scope.totalAnualidad += parseFloat($scope.tablaPrestamo[i].mensualidad);
          $scope.totalInteres += parseFloat($scope.tablaPrestamo[i].cuotaInteres);
        }

        // Redondear los totales a dos decimales
        $scope.totalAnualidad = $scope.totalAnualidad.toFixed(2);
        $scope.totalInteres = $scope.totalInteres.toFixed(2);

      }

      // Agregar un nuevo registro calculado al array

      var duracionTipo = $scope.cuotaType === "Cuota anual" ? "años" : "semestres";

      $scope.registrosCalculados.push({
        importe: $scope.sliderValue,
        duracion: $scope.duracionPrestamo + " " + duracionTipo,
        tipo: $scope.obtenerTituloPrestamo($scope.tipoPrestamo),
        fecha: new Date() // Agrega la fecha actual como parte del registro
      });



      //Insertar los datos en base de datos
      let paramPeticion = {
        datos: {
          idUsuario: JSON.parse(localStorage.getItem('usuarioLogueado')).id_usuario,
          importe: $scope.sliderValue,
          duracion: $scope.duracionPrestamo + " " + duracionTipo,
          tipo: $scope.obtenerTituloPrestamo($scope.tipoPrestamo),
          fecha: new Date()
        },
        metodo: "insertarRegistro",
      };


      $http
      .post("../Backend/Controladores/historicoControlador.php", paramPeticion)
      .then(function (response) {

      })
      .catch(function (error) {
        console.error("Error:", error);
      });
    };
  });
