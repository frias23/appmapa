



//controladores de la aplicación Angular
app = angular.module('mapsApp', []);
app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);/*Lista blanca de las url seguras permitidas*/
}]);
app.controller('MapCtrl', function($scope,$http) {
    //$scope.filename = '';
    //$scope.getArray = $scope.cities;
   $scope.cities = [
    {
        "estado" : 'ubicacion 2',
        "descripcion" : 'cunduacan',
        "latitud" : 56.238983,
        "longitud" : -3.888509 
    }
];
  /*método que permite agregar una nueva dirección al arreglo ciudades*/ 
  $scope.agregarDireccion = function(){
    $scope.cities.push({
      city: $scope.city,    
      desc: $scope.desc,
      lat: $scope.lat,
      long: $scope.long
    });
     /*Después de hacer el push, las propiedades quedan en blanco para dejar que un nuevo objeto*/
    $scope.city = ''
    $scope.desc = ''
    $scope.lat = ''
    $scope.long = ''
    
     /* se inicia el mapa de nuevo*/
    $scope.initialise();
    
  }
  /* método que permite eliminar un índice del arreglo, es decir, eliminar un objeto o ubicación*/
  $scope.removeMarker = function(index){
    $scope.cities.splice(index, 1);
    $scope.initialise();
    
  }

     /* configuraciones del mapa*/
$scope.initialise = function() {
        var myLatlng = new google.maps.LatLng(52.238983, -0.888509);
        var mapOptions = {
            center: myLatlng,
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
       // Geolocalización /
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                animation: google.maps.Animation.DROP,
                title: "Mi ubicación"
            });
        });
        $scope.map = map;
      console.log($scope.map,'this scope map');
       // Marcadores  //
        $scope.markers = [];
        var infoWindow = new google.maps.InfoWindow();
        var createMarker = function (info){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(info.lat, info.long),
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                title: info.city
            });
            //eventos//
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
            $scope.markers.push(marker);
        }  
        //ciclo for para realizar la creacion de los datos//
        for (i = 0; i < $scope.cities.length; i++){
            createMarker($scope.cities[i]);
        }

    };
    google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise()); 
    
    /* el arreglo a un archivo txt descargable*/
    $scope.saveJSON = function () {
			$scope.descargar = '';
        /*un nombre en vacio para llenarlo desde HTML*/
		
			$scope.descargar = angular.toJson($scope.cities);
            $scope.nombre;
            /*Variable que almacena el nombre del archivo dado por el usuario*/
		
			var blob = new Blob([$scope.descargar], { type:"application/json;charset=utf-8;" });			
        
			var downloadLink = angular.element('<a></a>');
                        downloadLink.attr('href',window.URL.createObjectURL(blob));
        
                        downloadLink.attr('download', $scope.nombre+'.txt');
			downloadLink[0].click();
      /*poder descargar el archivo como .txt */
		};

  });