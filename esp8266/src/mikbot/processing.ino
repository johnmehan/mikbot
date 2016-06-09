#include "Ticker.h"

Ticker stopTicker;
/*
 * processMove
 * 
 */
void processMove(char *direction){

    Serial.print(F("Move: "));
    Serial.println(direction);

    String command = String(direction);
    
    int duration = 300;
  
    //protect against driving the motors forward and back at the same time, accidentally
    stopBot();

    if (command.equalsIgnoreCase("F")) {
        forward();
    }
    else if (command.equalsIgnoreCase("B")) {
        backward();
    }
   else if (command.equalsIgnoreCase("R")) {
        right();
   }
   else if (command.equalsIgnoreCase("L")) {
        left();
   }
   else if (command.equalsIgnoreCase("D")) {
        dance(5);
        Serial.println("Dance");
   }
   else if (command.equalsIgnoreCase("sr")) {
        right();
        duration = 3000;
   }
   else if (command.equalsIgnoreCase("sl")) {
      left();
      duration = 3000;
      Serial.println("spin");
   }
   else if (command.equalsIgnoreCase("ar")) {
      arcright();
      Serial.println("arcright");
   }
   else if( command.equalsIgnoreCase("al")) {
      arcleft();
      Serial.println("arcleft");
   }
   else if (command.equalsIgnoreCase("chachacha")) {
      chachacha();
      Serial.println("chachacha");
   }
   else
   {
        Serial.println("Unknown move command");
    }

    stopTicker.once(duration/1000.0f, stopBot);
}

void forward() {

    Serial.println("both forward ");

    digitalWrite(PIN_RIGHT_Forward, 1);
    digitalWrite(PIN_LEFT_Forward, 1);
}

void backward() {

    Serial.println("both backward");

    digitalWrite(PIN_RIGHT_Backward, 1);
    digitalWrite(PIN_LEFT_Backward, 1);
   
}

void right() {

    Serial.println("Left forward, right back ");

    digitalWrite(PIN_RIGHT_Backward, 1);
    digitalWrite(PIN_LEFT_Forward, 1);
}

void arcright() {

    digitalWrite(PIN_LEFT_Forward, 1); 
}
void left() {

    Serial.println("Left back, right forward ");
    digitalWrite(PIN_RIGHT_Forward, 1);
    digitalWrite(PIN_LEFT_Backward, 1);
}

void arcleft() {

    digitalWrite(PIN_RIGHT_Forward, 1); 
}

void dance(int count) {

  for (int i = 0; i < count; i ++) {
    right();
    delay(500);
    stopBot();
    
    left();
    delay(500);
    stopBot();
  }
}


void chachacha() {

  forward();
  delay(500);
  stopBot();
  backward();
  delay(500);
  stopBot();

  arcright();
  delay(200);
  stopBot();
  arcleft();
  delay(200);
  stopBot();
  arcright();
  delay(200);
  stopBot();
  
  
}

void stopBot() {

    digitalWrite(PIN_RIGHT_Forward, 0);
    digitalWrite(PIN_RIGHT_Backward, 0);
    digitalWrite(PIN_LEFT_Forward, 0);
    digitalWrite(PIN_LEFT_Backward, 0);
}
/*
 * processConfigRequest  
 * /config
 */
void processConfigRequest(){

    Serial.println(F("PROCESSING CONFIG REQUEST"));

    Serial.print("args: ");
    Serial.println(server.args());

    if(server.hasArg(PARAM_SSID)){
          String ssid=server.arg(PARAM_SSID);
          Serial.print(F("SSID: "));
          Serial.println(ssid);
          setSSID(ssid.c_str());
    }

 
    if(server.hasArg(PARAM_SSIDPASS)){
          String ssidpass=server.arg(PARAM_SSIDPASS);
          Serial.print(F("SSID Pass: "));
          Serial.println(F("**********"));
          //Serial.println(ssidpass);
          setSSIDPass(ssidpass.c_str());
    }
    
    server.send(200, "text/plain", "Config Set");
    processReboot();
    
}

/*
 * processReboot  
 * /reboot
 * 
 */
void processReboot(){

    Serial.println(F("REBOOTING"));
    delay(1000);
    ESP.restart();
}


/*
 * processReset  
 * /reset
 * 
 */
void processReset(){

    Serial.println(F("RESETING BOARD"));
    setSSID("RESET");
    setSSIDPass("PASS");
    processReboot();
}

void showConfigPage(){

  char temp[400];
  int sec = millis() / 1000;
  int min = sec / 60;
  int hr = min / 60;

  snprintf ( temp, 400,

"<html>\
  <head>\
    <meta http-equiv='refresh' content='5'/>\
    <title>MikBOT</title>\
    <style>\
      body { background-color: #cccccc; font-family: Arial, Helvetica, Sans-Serif; Color: #000088; }\
    </style>\
  </head>\
  <body>\
    <h1>Hello from MikBOT!</h1>\
    <p>Uptime: %02d:%02d:%02d</p>\
  </body>\
</html>",
    hr, min % 60, sec % 60
  );
  server.send ( 200, "text/html", temp );
}


/*
 * setSSID
 */
void setSSID(const char *value){

    //clear EEPROM area
    for (int i = 0; i < 32; ++i){
            EEPROM.write(SSID_LOC +i ,0);
    }

    //save ssid to EEPROM
    for (int i = 0; i < strlen(value); ++i){
            EEPROM.write(SSID_LOC + i, value[i]);
    }
    
    EEPROM.commit();

}

/**
 * setSSIDPass
 */
void setSSIDPass(const char *value){
 
    //clear EEPROM area
    for (int i = 0; i < 64; ++i){
            EEPROM.write(SSID_PASS_LOC +i ,0);
    }

    //save ssid password to EEPROM
    for (int i = 0; i < strlen(value); ++i){
            EEPROM.write(SSID_PASS_LOC + i, value[i]);
    }
    
    EEPROM.commit();

}

