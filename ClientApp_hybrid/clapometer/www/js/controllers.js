angular.module('clap.controllers',[])
	.controller('ClapController',['$scope', function($scope, SOCKET_URL){
		var socket = io.connect('http://10.50.2.85:8001');
		$scope.sendClap = function(){
			console.log('send clap event');
  			socket.emit('event:new:clap',function(data){console.log('data'+data);});
		}
		
		socket.on('updateClap',function(data){
		$scope.counterValue = data;
		});

	}]);