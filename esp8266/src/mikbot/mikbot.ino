/***************************************************
MikBot

 ****************************************************/
#include <ESP8266WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"

/************************* WiFi Access Point *********************************/

#define WLAN_SSID       "mehan0"
#define WLAN_PASS       "casamehan"

/************************* Adafruit.io Setup *********************************/

#define AIO_SERVER      "m12.cloudmqtt.com"
#define AIO_SERVERPORT  13512                   // use 8883 for SSL
//#define AIO_USERNAME    "vytbbbwk"
//#define AIO_KEY         "yXqD81sADrdA"
#define AIO_USERNAME    "mikbot"
#define AIO_KEY         "mikbot"

/************************* PIN DEFINITIONS ************************************/

#define PIN_RIGHT_0   5
#define PIN_RIGHT_1   4
#define PIN_LEFT_0    13
#define PIN_LEFT_1    12

/************ Global State (you don't need to change this!) ******************/

// Create an ESP8266 WiFiClient class to connect to the MQTT server.
WiFiClient client;
// or... use WiFiFlientSecure for SSL
//WiFiClientSecure client;

// Store the MQTT server, username, and password in flash memory.
// This is required for using the Adafruit MQTT library.
const char MQTT_SERVER[] PROGMEM    = AIO_SERVER;
const char MQTT_USERNAME[] PROGMEM  = AIO_USERNAME;
const char MQTT_PASSWORD[] PROGMEM  = AIO_KEY;

// Setup the MQTT client class by passing in the WiFi client and MQTT server and login details.
Adafruit_MQTT_Client mqtt(&client, MQTT_SERVER, AIO_SERVERPORT, MQTT_USERNAME, MQTT_PASSWORD);

/****************************** Feeds ***************************************/

// Setup a feed called 'photocell' for publishing.
// Notice MQTT paths for AIO follow the form: <username>/feeds/<feedname>
//const char CONNECT_FEED[] PROGMEM = AIO_USERNAME "/connect";
const char CONNECT_FEED[] PROGMEM = "connect";
Adafruit_MQTT_Publish connectFeed = Adafruit_MQTT_Publish(&mqtt, CONNECT_FEED);

// Setup a feed called 'onoff' for subscribing to changes.
//const char MOVE_FEED[] PROGMEM = AIO_USERNAME "/move";
const char MOVE_FEED[] PROGMEM = "move";
Adafruit_MQTT_Subscribe moveFeed = Adafruit_MQTT_Subscribe(&mqtt, MOVE_FEED);



// Bug workaround for Arduino 1.6.6, it seems to need a function declaration
// for some reason (only affects ESP8266, likely an arduino-builder bug).
void MQTT_connect();
void processMove(char *);







