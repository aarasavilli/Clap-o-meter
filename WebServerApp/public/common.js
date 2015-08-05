///////Index.html related script

var socket = io.connect();
var gauge;
var chart;

var initialDate =  new Date().getTime();
	var opts = {
  lines: 12, // The number of lines to draw
  angle: 0.15, // The length of each line
  lineWidth: 0.44, // The line thickness
  pointer: {
    length: 0.9, // The radius of the inner circle
    strokeWidth: 0.035, // The rotation offset
    color: '#000000' // Fill color
  },
  limitMax: 'false',   // If true, the pointer will not go past the end of the gauge
  colorStart: '#6FADCF',   // Colors
  colorStop: '#8FC0DA',    // just experiment with them
  strokeColor: '#E0E0E0',   // to see which ones work best for you
  generateGradient: true
};
var target = document.getElementById('foo'); // your canvas element
gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 30; // set max gauge value
gauge.animationSpeed = 43; // set animation speed (32 is default value)

	socket.on('dataForGraphToUI',function(data){
		dataForGraph = data;
		console.log('Data from client------:'+dataForGraph);
		chart.series[0].setData(dataForGraph);
	});

socket.on('updateClapinUI',function(counter){
		
		gauge.set(counter);
		document.getElementById('odo').innerHTML = counter;
    });
	
	//update barchart on each question event
	socket.on('UpdateQuestionResponseinUI',function(id,result){
	console.log(id+""+result);
	if(!$("#container").is(':visible'))
	{
	console.log("visible"+$("#container").is(':visible'));
	$('#container').show();
	$('#combobox').show();
	}
			$('#container').show();

	var questionno=id+1;
	questionno="Ques."+questionno;
	addoptiontoCombo(""+questionno);			
	console.log(result.question+result.yesCount+result.noCount+result.dontCareCount);
	var dataForGraph;
	if($('#combobox :selected').text()==="Select Question")
	{
	console.log("inside combobox if");
	aa(result.question,result.yesCount,result.noCount,result.dontCareCount,result.notAnswered);
	}
    });
	socket.on('gotresponseforquestionselectedOnUI',function(result){
		aa(result.question,result.yesCount,result.noCount,result.dontCareCount,result.notAnswered);
	});
	
	
	function getCounterValue() {
		socket.emit('event:get:countervalue',function(counterValue) {
				alert('call back called'+counterValue);
		});
	}
	function addoptiontoCombo(questionno) {
    var combo = document.getElementById("combobox");
     
    var option = document.createElement("option");
    option.text = questionno;
    option.value = questionno;
    try {
	console.log($("#combobox option[value='"+questionno+"']").length > 0);
	if(!$("#combobox option[value='"+questionno+"']").length > 0)
	{
        combo.add(option, null); //Standard 
	}
    }catch(error) {
	if(!$("#combobox option[value='yourValue']").length > 0)
	{
        combo.add(option); // IE only
	}
       
    }
   questionno= "";
}

	
	function selectquestion() {
	var selectedquestion=$('#combobox :selected').text();
	var split=selectedquestion.split(".")
    var selectedquestionid = split[1]-1;
	//alert(selectedquestionid);
		if(selectedquestionid || selectedquestionid === 0) {
			socket.emit('event:sendquestionselected',selectedquestionid);
		}
	}
   
   
function aa(question,yescnt,nocnt,dontcarecnt,notanswered) {
	
		var chartData = [yescnt, nocnt, dontcarecnt,notanswered];
		 chart.setTitle({
         text: question
        });
		chart.series[0].setData(dataForGraph);
		
	

	}
	
	//added by sonal

$(function () {
	// create chart
	

	//$('#container').hide();
	$('#combobox').hide();
	chart = new Highcharts.Chart({
        chart: {
		renderTo: 'container',
            type: 'StockChart'
        },
        title: {
            text: 'Response Count'
        },
        xAxis: {
			  gapGridLineWidth: 0
            //categories: ['Yes', 'No', 'Dont Care','Not Answered']
			
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total count response'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
		
        series: [{
            name: 'QuestionClapedCount',
			type: 'area',
			gapSize: 5,
            data: [15, 20, 40, 20]
        }]
    });

	
	
	//setInterval(aa, 2000);
	
 
});
	
/*	function updateNameChange() {
		socket.emit('nameChanged', document.getElementById('selectedName').value);
		chart.series[0].setData(dataForGraph);
//		var currentTime =  initialDate - new Date().getTime(); 
		//alert('time'+currentTime+'Xaxis value'+chart.xAxis.tick);
		//chart.xAxis[0].addPlotBand();

	}*/
	
	// Admin console realted java script    
function addoptiontoCombo(person_name) {
    var combo = document.getElementById("combobox");
     
    var option = document.createElement("option");
    option.text = person_name;
    option.value = person_name;
    try {

	if(!$("#combobox option[value='"+person_name+"']").length > 0)
	{
        combo.add(option, null); //Standard 
	}
    }catch(error) {
	if(!$("#combobox option[value='person_name']").length > 0)
	{
        combo.add(option); // IE only
	}
       
    }
   questionno= "";
}
function adduser()
{
var username=$("input:text").val();
alert('User:'+username);
addoptiontoCombo(username);
}
	
	function selectUser() {
		var selectedPerson=$('#combobox :selected').text();
		alert('Selected person is :'+selectedPerson);
		socket.emit('nameChanged', selectedPerson);
		chart.series[0].setData(dataForGraph);
	}

