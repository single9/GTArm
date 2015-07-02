var cv = require('opencv');
var app = require('express')();
var http = require('http').Server(app);
var port = 3636;
var io = require('socket.io')(http);
var mime = require("mime");
var fs = require('fs');
var util = require("util");
var camera = new cv.VideoCapture(0);
var armCamera = new cv.VideoCapture(1);

var COLOR = [255, 255, 255]; // default red
var thickness = 20; // default 1
var cmdString = "";
var faceX = 0, faceY = 0, preX = 0, preY = 0;
var faceEnabled = false;
// dev/tty.usbserial
// /dev/tty.wchusbserial1420

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});
    
io.on('connection', function( socket ){
	socket.on('hi', function(){
		io.emit('hi');
	});
	socket.on('cmd', function( user_cmd ){
		//console.log('USER CMD: ' + user_cmd);
		sendCmd( user_cmd );
	});
	socket.on('enableFace', function( en ){
		//console.log('face enable CMD: ' + enableFace);
		io.emit('enableFace', !en)
		faceEnabled = !en;
	});
});

setInterval(function(){
    if ( faceEnabled ) faceMove();
  }, 500);

function faceMove () {
	camera.read(function(err, im) {
      if (err) throw err;
      //window.show(im);
      //window.blockingWaitKey(0, 50);
      if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

      im.detectObject('./data/haarcascade_frontalface_alt.xml', {}, function(err, faces) {
        if (err) throw err;
        var biggest = 0, temp_facewidth = 0;
        for (var i = 0; i < faces.length; i++){
          var face = faces[i];
          im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
          if ( (face.width > 200) && (face.width > temp_facewidth)) {
          	temp_facewidth = face.width;
          	faceX = face.x;
          	faceY = face.y;
          };
          //console.log("Width: " + face.width );
        }
        im.save("gg.jpg");
        //pic = im.toBuffer();
      });
	    //console.log( msg );
	    //io.emit('pic', '<img src="gg.jpg?' + random(1,10) + '">');
	    var baseImg = base64Image("gg.jpg");

	    //console.log( baseImg );
	    io.emit( 'facePic', baseImg );
	    if ( preX == 0) { preX = faceX };
	    if ( preY == 0) { preY = faceY };
	    if ( 630 - faceX > 300 ) { sendCmd("R") }
	    else if ( 630 - faceX < -100 ) { sendCmd("L") }
	    //if ( preX - faceX > 20 ) { sendCmd("R") }
	    //else if ( preX - faceX < -20 ) { sendCmd("L") }
	    //else if ( 350 - faceY > 200 ) { sendCmd("U") }
	    //else if ( 350 - faceY < 140 ) { sendCmd("D") }
	    //else if( preX - faceX > -10 && preX - faceX < 10) { sendCmd("x") };
	    else { sendCmd( "x" ) };
	    //console.log("PY - FY: " + (preY - faceY) );
	    preX = faceX;
	    preY = faceY;
    });
	armCamera.read(function(err, im) {
      if (err) throw err;
        im.save("armCamera.jpg");
        //pic = im.toBuffer();
        var baseImg = base64Image("armCamera.jpg");
        io.emit( 'pic', baseImg );
    });
}

function sendCmd( cmd ) {
	var SerialPort = require("serialport").SerialPort;
	// SerialPort ( Port )
	var serialPort = new SerialPort("/dev/tty.usbserial", {
	  baudrate: 9600
	});
	serialPort.on("open", function () {
	  //console.log('open');
	  serialPort.write(cmd, function(err, results) {
	  	console.log('USER CMD: ' + cmd);
	  });
	});
}

function base64Image(src) {
  var data = fs.readFileSync(src).toString("base64");
  //console.log('MIME: ' + mime.lookup(src));
  return util.format("data:%s;base64,%s", mime.lookup(src), data);
}

http.listen(port, function(){
  console.log('listening on *' + port);
});