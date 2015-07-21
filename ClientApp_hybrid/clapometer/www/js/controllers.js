angular.module('clap.controllers',[])
	.controller('ClapController',['$scope', function($scope, SOCKET_URL){
		var socket = io.connect('http://172.16.107.151:8001');
		$scope.sendClap = function(){
			console.log('send clap event');
  			socket.emit('event:new:clap',function(data){
				console.log('data'+data);
			});
		}
		
		socket.on('updateClap',function(data){
			$scope.counterValue = data;
		});

	}]);