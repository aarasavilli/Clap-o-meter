angular.module('clap.controllers',['ionic'])
	.controller('ClapController',function($scope, $ionicPopup, $timeout){
		var socket = io.connect('http://localhost:8001');
		$scope.sendClap = function(){
  			 socket.emit('event:new:clap',function(data){
				console.log('data'+data);
			}); 

		}
		
		socket.on('showQuestion',function(question){
			var myPopup = $ionicPopup.show({
    template: question,
    title: 'Quiz',
    subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
	  { text: 'None' },
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          console.log('Tapped! Save');
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
  $timeout(function() {
     myPopup.close(); //close the popup after some seconds 
  }, 5000);
 

   

		});

	});