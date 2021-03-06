
// Function to connect and reconnect as necessary to the MQTT server.
// Should be called in the loop function and it will take care if connecting.
bool MQTT_connect() {
  int8_t ret;

  // Stop if already connected.
  if (mqtt.connected()) {
    return true;
  }

  Serial.print("Connecting to MQTT ... ");

  if( mqtt.connect() != 0) { // connect will return 0 for connected
       Serial.println(mqtt.connectErrorString(ret));
       mqtt.disconnect();
       Serial.println("Failed to connect to MQTT!");
       return false;
  }

  snprintf(DEBUG_MSG,DEBUG_MSG_LEN,"%i.%i.%i.%i\n",ipAddress[0],ipAddress[1],ipAddress[2],ipAddress[3]);
  connectFeed.publish(DEBUG_MSG);
  Serial.println("MQTT Connected!");
  return true;
  
}
