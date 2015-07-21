/**
 * tenMinutes.registro Module
 *
 * Description
 */
angular.module('vinteMinutos.registro').
controller('RegistroCtrl', ['$scope','RegistroService','ngTableParams','$filter','UsuarioService',function ($scope, RegistroService, ngTableParams, $filter, UsuarioService) {
	$scope.setRegistro = function(usr){
		$scope.registro = new RegistroService(usr);
	}
	$scope.registrar = function(){
		RegistroService.registrar($scope.usuario);
	}
	UsuarioService.load().then(function(data){
		$scope.usuarios = data;
	});

	$scope.remover = function(){
		new RegistroService($scope.registro).remover($scope.usuario);
	}
	$scope.$watch('usuario._id', function(newVal, oldVal){
		$scope.showForm = $scope.usuario !== undefined && $scope.usuario._id !== undefined;
		if(newVal != oldVal){
			$scope.table.reload();
		}
	});
	$scope.setRegistro();
	$scope.filter = {
			name: undefined,
			age: undefined
	};

	$scope.$on('RegistroService:save',function(data){
		$scope.addAlert({
			msg : 'Registro salvo com sucesso',
			type: 'success'
		});
		$scope.table.reload();
	});
	$scope.checkRegistro = function(reg){
		var regDate = new Date(reg.dataEHora);
		var dt = new Date($scope.registro.dataEHora);
		return angular.equals(regDate, dt);
	}
	$scope.$on('RegistroService:remove',function(data){
		$scope.addAlert({
			msg : 'Registro removido com sucesso',
			type: 'success'
		});
		$scope.table.reload();
	});
	$scope.table = new ngTableParams({
		page: 1,            // show first page
		count: 10
	}, {
		total: 0,
		groupBy: 'data',
		getData: function($defer, params) {
			RegistroService.load($scope.usuario).then(function(data){
				var  filtered = params.filter ?
						$filter('filter')(data, params.filter()) :
							data;

						var orderedData = params.sorting() ?
								$filter('orderBy')(filtered, $scope.table.orderBy()) :
									filtered;

								params.total(orderedData.length);
								$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			});
		}
	});
}])