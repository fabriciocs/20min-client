/**
 *  Module
 *
 * Description
 */
angular.module('vinteMinutos', ['ui.router', 'restangular','ngTable','ui.bootstrap','ngAnimate', 'vinteMinutos.usuario', 'vinteMinutos.registro']).
config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider',function($stateProvider, $urlRouterProvider, RestangularProvider){
	$urlRouterProvider.otherwise("/usuario");

	$stateProvider
	.state('usuario', {
		url: "/usuario",
		templateUrl: "views/usuario/usuario.html",
		controller: 'UsuarioCtrl'
	}).state('registro', {
		url: "/registro",
		templateUrl: "views/registro/registro.html",
		controller: 'RegistroCtrl'
	});

	RestangularProvider.setRestangularFields({
		id: "_id"
	});
	RestangularProvider.setBaseUrl('http://192.7.1.106:8089');
}])
.run(['$rootScope','$timeout', function($rootScope,$timeout ){
	$rootScope.alerts = [];
	$rootScope.closeAlert = function(index){
		$rootScope.alerts.splice(index, 1);
	}
	$rootScope.addAlert =  function(alert){
		$rootScope.alerts.push(alert);
		$timeout(function(){
			var index = $rootScope.alerts.indexOf(alert);
			$rootScope.closeAlert(index);
		},5000);
	}
}]);