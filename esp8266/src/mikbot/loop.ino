uint32_t x=0;

void loop() {
  // Ensure the connection to the MQTT server is alive (this will make the first
  // connection and automatically reconnect when disconnected).  See the MQTT_connect
  // function definition further below.


  //BLINK STATUS LED
  
/*  

 if (millis() - lastBlink > blinkInterval){
          if(led_val==LOW) {
            led_val=HIGH;
            setLEDStatus();
          }else{
            led_val=LOW;
            setLEDOff();
          }
          lastBlink = millis();
  }
*/


  if(is_accesspoint==false){
  
      if(MQTT_connect()){
          // this is our 'wait for incoming subscription packets' busy subloop
          // try to spend your time here
        
          Adafruit_MQTT_Subscribe *subscription;
          while ((subscription = mqtt.readSubscription(5000))) {
            if (subscription == &moveFeed) {
              processMove((char *)moveFeed.lastread);
            }
          }

          /*
          Serial.print(F("\nSending connect val "));
          if (! connectFeed.publish(x++)) {
            Serial.println(F("Failed"));
          } else {
            Serial.println(F("OK!"));
          }
          */
          // ping the server to keep the mqtt connection alive
          // NOT required if you are publishing once every KEEPALIVE seconds
          if(! mqtt.ping()) {
            Serial.println("ping failed");
            mqtt.disconnect();
          }

      }
  }
  

  //handle http commands
  server.handleClient();

  //process serial requests
  //processSerialRequests();
  
  
}
