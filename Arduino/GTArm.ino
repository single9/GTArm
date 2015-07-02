#include <Servo.h>

int value = 0 ;
int vec_angle[4];
char s;
Servo servo_pin_11;
Servo servo_pin_10;
Servo servo_pin_9;
Servo servo_pin_5;

void turnservo();
void initarray();
void initservo();

void setup()
{
   Serial.begin(9600);
  for (int i=0;i<4;i++) vec_angle[i]=0;

  servo_pin_11.attach(11);
  servo_pin_10.attach(10);
  servo_pin_9.attach(9);
  servo_pin_5.attach(5);
  initarray();
  initservo();
}

void loop()
{
  if (Serial.available() > 0) 
  {
    s = Serial.read(); 
  }
   switch(s)
    {
      case('R'):vec_angle[0]=vec_angle[0]-1;break;
      case('L'):vec_angle[0]=vec_angle[0]+1;break;
      case('U'):vec_angle[2]=vec_angle[2]+1;break;
      case('D'):vec_angle[2]=vec_angle[2]-1;break;
      case('S'):vec_angle[1]=vec_angle[1]+1;break;
      case('B'):vec_angle[1]=vec_angle[1]-1;break;
      case('C'):vec_angle[3]=vec_angle[3]-1;break;
      case('Y'):vec_angle[3]=vec_angle[3]+1;break;
      default:;break;
    }
    if(vec_angle[0]<20)vec_angle[0]=20;
    else if(vec_angle[0]>160)vec_angle[0]=160;
    if(vec_angle[3]<112)vec_angle[3]=112;
    else if(vec_angle[3]>160)vec_angle[3]=160;
    if(vec_angle[2]<75)vec_angle[2]=75;
    else if(vec_angle[2]>175)vec_angle[2]=175;
    if(vec_angle[1]<80)vec_angle[1]=80;
    else if(vec_angle[1]>145)vec_angle[1]=145;
  turnservo();
  delay( 30 );
}

void initarray()
{
  vec_angle[0] = 90 ;
  vec_angle[1] = 90 ;
  vec_angle[2] = 90 ;
  vec_angle[3] = 112 ;
}

void turnservo()
{
  servo_pin_11.write( vec_angle[0] );
  servo_pin_10.write( vec_angle[1] );
  servo_pin_9.write( vec_angle[2] );
  servo_pin_5.write( vec_angle[3] );
}

void initservo()
{
  servo_pin_11.write( vec_angle[0] );
  servo_pin_10.write( vec_angle[1] );
  servo_pin_9.write( vec_angle[2] );
  servo_pin_5.write( vec_angle[3] );
}


