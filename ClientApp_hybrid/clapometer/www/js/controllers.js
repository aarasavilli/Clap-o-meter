angular.module('clap.controllers',['ionic'])
	.controller('ClapController',function($scope, $ionicPopup, $timeout,$ionicSlideBoxDelegate){
		var socket = io.connect('http://localhost:8001');
		$scope.counter = 60;
		$scope.sendClap = function(){
  			 socket.emit('event:new:clap',function(data){
				console.log('data'+data);
			}); 

		}
		
		$scope.countdown = function() {
			stopped = $timeout(function() {
			   console.log($scope.counter);
			 $scope.counter = ($scope.counter+1);   
			 if($scope.counter==0)
			  $scope.counter=60;	
		  
				$scope.countdown();   
			}, 1000);
		  };
				
		
		
  var responseText=['yesCount','noCount','dontCareCount','notAnswered'];
  var questionAnswered=false;
   $scope.responsenoCount=function(index){	  
	   console.log(index + responseText[index]);
	   socket.emit('questionResponse', $scope.queNumber, responseText[index]);	   
	  // $ionicSlideBoxDelegate.slide(1);
       $scope.countdown();
	   questionAnswered=true;

   }
   
  socket.on('showQuestion',function(queNumber,question,ansOptions){
			$scope.questionText = question;
			$scope.queNumber = queNumber;
			//$ionicSlideBoxDelegate.slide(2);
			console.log('Answer options are:'+ansOptions);
			questionAnswered=false;
			$timeout(function() {		
			    if(!questionAnswered)
					$scope.responsenoCount(3);
			}, 5000);
			
			/*var myPopup = $ionicPopup.show({
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
  }); */
 
  /*myPopup.then(function(response) {
	  $ionicSlideBoxDelegate.slide(1);

	  $scope.countdown();
	if(response)
		socket.emit('questionResponse', queNumber, response);
	else
		socket.emit('questionResponse', queNumber, 'notAnswered');
  }); 
  $timeout(function() {
     myPopup.close(); //close the popup after some seconds 
  }, 5000); */
 

		});

	});
	