angular.module('vinteMinutos.usuario').
service('UsuarioService', ['Restangular','$q','$timeout','$rootScope',function (Restangular, $q, $timeout, $rootScope) {
	var Server = Restangular.all("usuarios");
	function UsuarioService(obj){
		if(obj){
			angular.extend(this, obj);
		}
		this.id = this.usrNome + " - " + this.usrLogin;
	}

	UsuarioService.load = function(first_argument) {
		return Server.getList().then(function(data){
			data.forEach(function(dt, index){
				data[index] = new UsuarioService(dt);
			});
			$rootScope.$broadcast("UsuarioService:load",{});
			return data;
		});
	}
	UsuarioService.prototype.save = function(){
		var self = this;
		return Server.post(self).then(function(){
			$rootScope.$broadcast("UsuarioService:save",{});
		});
	}
	
	UsuarioService.prototype.remove = function(){
		var self = this;
		return Server.remove(self).then(function(){
			$rootScope.$broadcast("UsuarioService:remove",{});
		});
	}	
	
	return UsuarioService;
}])