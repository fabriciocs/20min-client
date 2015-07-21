angular.module('vinteMinutos.registro').
service('RegistroService', ['Restangular','$q','$timeout','$rootScope','UsuarioService','$filter',function (Restangular, $q, $timeout, $rootScope, UsuarioService, $filter) {
	var Server = Restangular.all("registros");
	function RegistroService(obj){
		if(obj){
			angular.extend(this, obj);
			this.dataEHora = new Date(obj.dataEHora);
		}
	}
	function preventNull(usuario, fun){
		var deferred =  $q.defer();
		if(usuario){
			return fun(usuario, deferred);
		}else{
			return deferred.promise;
		}
	}

	RegistroService.load = function(usuario) {
		return preventNull(usuario, function(usuario, deferred){
			return Server.one(usuario._id).getList().then(function(data){
				data.forEach(function(registro){
					registro.data = $filter('date')(registro.dataEHora, 'dd/MM/yyyy');
				})
				$rootScope.$broadcast("RegistroService:load",{});
				deferred.resolve(data);
				return data;
			});
		})
	}
	RegistroService.registrar = function(usuario) {
		var self = new RegistroService({});
		return preventNull(usuario, function (usuario, deferred){
			return RegistroService.last(usuario).then(function(data){
				var tipo = data ?  data.tipo : 'Entrada';
				self.dataEHora = Date.now();
				self.tipo =  (tipo === 'Saida'? 'Entrada' : 'Saida');
				self.usuario = usuario;
				self.save(usuario);
				deferred.resolve(self);
			});		
		});
	}
	RegistroService.last = function(usuario) {
		return preventNull(usuario, function(usuario, deferred){
			return Server.one('lasttipo').one(usuario._id).get().then(function(data){
				$rootScope.$broadcast("RegistroService:last",{});
				deferred.resolve(data);
				return data;
			});
		});
	}
	RegistroService.prototype.save = function(usuario){
		var self = this;
		return preventNull(usuario, function(usuario, deferred){
			return Server.all(usuario._id).post(self).then(function(data){
				$rootScope.$broadcast("RegistroService:save",{});
				deferred.resolve(data);
				return data;
			});
		});
	}

	RegistroService.prototype.remover = function(usuario){
		var self = this;
		return preventNull(usuario, function(usuario, deferred){
			return Server.one(usuario._id).one($filter('date')(self.dataEHora, 'yyyy-MM-ddTHH:mm:ss.sssZ')).remove().then(function(){
				$rootScope.$broadcast("RegistroService:remove",{});
				deferred.resolve(self);
			});
		});
	}	

	return RegistroService;
}])