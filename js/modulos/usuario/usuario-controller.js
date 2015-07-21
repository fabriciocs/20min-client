/**
 * tenMinutes.usuario Module
 *
 * Description
 */
angular.module('vinteMinutos.usuario').
controller('UsuarioCtrl', ['$scope','UsuarioService','ngTableParams','$filter','UsuarioService',function ($scope, UsuarioService, ngTableParams, $filter, UsuarioService) {
	$scope.setUsuario = function(usr){
		$scope.usuario = new UsuarioService(usr);
	}
	$scope.setUsuario();
	$scope.filter = {
			name: undefined,
			age: undefined
	};

	$scope.$on('UsuarioService:save',function(data){
		$scope.$root.addAlert({
			msg : 'Usuário salvo com sucesso',
			type: 'success'
		});
		$scope.table.reload();
	});
	$scope.$on('UsuarioService:remove',function(data){
		$scope.$root.addAlert({
			msg : 'Usuário removido com sucesso',
			type: 'success'
		});
		$scope.table.reload();
	});
	$scope.table = new ngTableParams({
		page: 1,            // show first page
		count: 10
	}, {
		total: 0,
		getData: function($defer, params) {
			UsuarioService.load().then(function(data){
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