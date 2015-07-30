angular.module('clap.controllers',['ionic'])
	.controller('ClapController',function($scope, $ionicPopup, $timeout){
		var socket = io.connect('http://localhost:8001');
		$scope.sendClap = function(){
  			 socket.emit('event:new:clap',function(data){
				console.log('data'+data);
			}); 

		}
		
		socket.on('showQuestion',function(queNumber,question,ansOptions){
			console.log('Answer options are:'+ansOptions);
			var myPopup = $ionicPopup.show({
    template: question,
    title: 'Quiz',
    subTitle: '',
    scope: $scope,
    buttons: [
	  { text: 'Dont Care',
		onTap: function(e) { return 'dontCareCount'; }
	  },
      { text: 'No',
		onTap: function(e) { return 'noCount'; }
      },
      {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function(e) { return 'yesCount'; }
      }
    ]
  });
  myPopup.then(function(response) {
	if(response)
		socket.emit('questionResponse', queNumber, response);
	else
		socket.emit('questionResponse', queNumber, 'notAnswered');
  });
  $timeout(function() {
     myPopup.close(); //close the popup after some seconds 
  }, 5000);
 

   

		});

	});