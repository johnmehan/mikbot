
  

void setLEDOff(){
  setColor(0,0,0);
}

void setLEDStatus(){
  //Serial.print("Status:");
  //Serial.println(status);
  setColor(statusColors[status][0],statusColors[status][1],statusColors[status][2]);
}

void setColor(int red, int green, int blue)
{
  #ifdef COMMON_ANODE
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
  #endif
  analogWrite(PIN_STATUS_RED, red);
  analogWrite(PIN_STATUS_GREEN, green);
  analogWrite(PIN_STATUS_BLUE, blue);  
}
