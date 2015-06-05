var app = require('express')();
var http = require('http').Server(app);
var port = 3636;
var io = require('socket.io')(http);
var cmdString = "";
var sendFlag = false;

// dev/tty.usbserial
// /dev/tty.wchusbserial1420

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});
    
io.on('connection', function( socket ){
	socket.on('cmd', function( user_cmd ){
		console.log('USER CMD: ' + user_cmd);
		sendCmd( user_cmd );
	});
});

function sendCmd( cmd ) {
	var SerialPort = require("serialport").SerialPort;
	// SerialPort ( Port )
	var serialPort = new SerialPort("/dev/tty.usbserial", {
	  baudrate: 9600
	});
	serialPort.on("open", function () {
	  console.log('open');
	  serialPort.on('data', function(data) {
	    console.log('data received: ' + data);
	  });
	  serialPort.write(cmd, function(err, results) {
	  	console.log('USER CMD: ' + cmd);
	    console.log('err ' + err);
	    console.log('results ' + results);
	  });
	});
}

function done() {
	console.log('done!');
}

http.listen(port, function(){
  console.log('listening on *' + port);
});