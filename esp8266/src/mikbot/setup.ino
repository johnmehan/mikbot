void setup() {
  Serial.begin(115200);
  delay(10);


  //initialize EEPROM
  EEPROM.begin(512);

  //setSSID("RESET");
  //setSSIDPass("TEST");
  
  Serial.println(F("MikBot - Starting ****** "));

  snprintf(DEBUG_MSG,DEBUG_MSG_LEN,"ESP [Id:%x] \n",ESP.getChipId());
  Serial.println(DEBUG_MSG);
  
  snprintf(DEBUG_MSG,DEBUG_MSG_LEN,"Flash [Id:%x; Size:%i bytes; Speed:%i Hz] \n",ESP.getFlashChipId(),ESP.getFlashChipRealSize(),ESP.getFlashChipSpeed());
  Serial.println(DEBUG_MSG);

  //set PIN MODES
  pinMode(PIN_RIGHT_Forward, OUTPUT); 
  pinMode(PIN_RIGHT_Backward, OUTPUT); 
  pinMode(PIN_LEFT_Forward, OUTPUT); 
  pinMode(PIN_LEFT_Backward, OUTPUT); 

  readSSIDValues();  
  setupWiFi();

  // Setup MQTT subscription for move feed.
  mqtt.subscribe(&moveFeed);
}

