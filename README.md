# GTArm

6月多時參加南部 Maker 展時所製作的機械手臂控制器，原本只有單純的控制，最後莫名其妙的變成了用臉去控制手臂移動的方向，然後在控制端上顯示手臂上攝影機所拍得的畫面。

## 使用

要啟動控制器，首先你得要擁有手臂的 Arduino 控制程式，這部分你可以在 Arduino 資料夾中找到。

之後你還需要一台裝有 NodeJS 的電腦，並且安裝以下套件：

	npm install express socket.io mime serialport peterbraden/node-opencv

然後修改這行

	var serialPort = new SerialPort("/dev/tty.usbserial"

將`/dev/tty.usbserial`改成你電腦與手臂所連結的Port。

之後，在終端中輸入

	node server.js

就會執行本程式了。

執行前記得裝上至少一個 USB 攝影機，在 server.js 程式碼中可以關閉手臂的第二個攝影機，只要把這行註解掉即可。

	var armCamera = new cv.VideoCapture(1);

## 硬體

- [MeArm.Joystick](http://mearm.weebly.com)
- [Arduino Uno](https://www.arduino.cc)
- MacBook Air
- USB Camera

## 開發者

手臂硬體程式：[Single Zero](http://single9.net)

電腦控制端：[Duye Chen](http://single9.net)