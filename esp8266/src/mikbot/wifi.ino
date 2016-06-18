void configureAndStartServer(){

  //SERVER INIT
  httpUpdater.setup(&server);
  
  server.on("/config",HTTP_GET,processConfigRequest);
  server.on("/reboot",HTTP_GET,processReboot);
  server.on("/reset",HTTP_GET,processReset);
  server.onNotFound ( showConfigPage );
  
  server.begin();
  
  
}

/*----------------------------------------------------
 * readSSIDValues
 ---------------------------------------------------*/
 void readSSIDValues(){
  
  // read eeprom for ssid and pass
  //Serial.println("Reading EEPROM ssid");

  for (int i=0; i<32;i++){
    char c = char(EEPROM.read(SSID_LOC + i));
    ssid[i] = c;
    if(c==0){
      break;
    }
  }
  
  //Serial.print("SSID: ");
  //Serial.println(ssid);
  
  //Serial.println("Reading EEPROM pass");
  
  for (int i=0; i<64;i++){
    char c = char(EEPROM.read(SSID_PASS_LOC + i));
    ssid_password[i] = c;
    if(c==0){
      break;
    }
  }
  
  
  //Serial.print("PASS: ");
  //Serial.println(ssid_password);  

 }


void setupWiFi()
{
  WiFi.macAddress(MAC_ADDRESS);
  
  if ( strlen(ssid) > 1 ) {
    
      //snprintf(DEBUG_MSG,DEBUG_MSG_LEN,"SSID: '%s' PASS: '%s'\n",ssid,ssid_password);
      //Serial.println(DEBUG_MSG);

    
      snprintf(DEBUG_MSG,DEBUG_MSG_LEN,"Connecting to %s ",ssid);
      Serial.print(DEBUG_MSG);

      WiFi.begin(ssid, ssid_password);
      if ( testWifi() == 20 ) { 
        
          // connected
          Serial.print(F("- Connected! \n"));
           // Print the IP address
           ipAddress = WiFi.localIP();
           printIPAddress(ipAddress);

            //setup mdns 
            if (!MDNS.begin(HOSTNAME)) {   //if (!mdns.begin(HOSTNAME, WiFi.localIP())) {
                   Serial.println(F("Error setting up MDNS responder!\n"));
            }else{
                   snprintf(DEBUG_MSG,DEBUG_MSG_LEN,"MDNS Responder Setup: Hostname: %s.local\n",HOSTNAME);
                   Serial.println(DEBUG_MSG);  
            }

            // Start the server
            configureAndStartServer();
            MDNS.addService("http", "tcp", 80);
            
            status=STATUS_RUNNING;
            setLEDStatus();


      }else{
           Serial.print(F("Failed! Starting Access Point\n"));
           setupAP(); 
           configureAndStartServer();
      }
  }else{
    //setup access point
     setupAP(); 
     configureAndStartServer();
  }

  
  

}

// ************************************************
// testWifi
// ************************************************
int testWifi(void) {
 
  int c = 0;
  while ( c < 20 ) {
    if (WiFi.status() == WL_CONNECTED) { return(20); } 
    delay(500);
    Serial.print(".");
    c++;
  }
  return(10);
} 

// ************************************************
// setupAP
// ************************************************
void setupAP(void) {

  status=STATUS_ACCESS_POINT;
  setLEDStatus();
  
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  WiFi.softAP(DEFAULT_SSID);

  snprintf(DEBUG_MSG,DEBUG_MSG_LEN,"Access Point Started with SSID: %s\n",DEFAULT_SSID);
  Serial.println(DEBUG_MSG);
  
  ipAddress=WiFi.softAPIP();
  printIPAddress(ipAddress);

  is_accesspoint=true;
}

// ************************************************
// printIPAddress
// ************************************************
void printIPAddress(IPAddress ipAddress){

  snprintf(DEBUG_MSG,DEBUG_MSG_LEN,"IP address: = %i.%i.%i.%i\n",ipAddress[0],ipAddress[1],ipAddress[2],ipAddress[3]);
  Serial.println(DEBUG_MSG);

}
