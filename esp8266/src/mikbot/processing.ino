/*
 * processMove
 * 
 */
void processMove(char *direction){

    Serial.print(F("Move: "));
    Serial.println(direction);

  
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
          Serial.println(ssidpass);
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
    void(* rebootFunc) (void) = 0;//declare reset function at address 0
    rebootFunc();

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

