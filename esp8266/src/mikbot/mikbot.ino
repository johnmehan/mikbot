// **********************************************
// MIKBOT 
// **********************************************


#include <ESP8266WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPUpdateServer.h>
#include <EEPROM.h>

// **********************************************
// PARAMETERS
// **********************************************
#define PARAM_SSID "ssid"
#define PARAM_SSIDPASS "ssidpass"

// **********************************************
// EEPROM MEM LOCATIONS
// **********************************************
#define SSID_LOC 0  //32 bytes
#define SSID_PASS_LOC  22 //64 bytes


// **********************************************
// WIFI CONFIG
// **********************************************
int HTTP_LISTEN_PORT = 80;
const char* HOSTNAME = "mikbot";
const char* DEFAULT_SSID = "MIKBOT";

char ssid[33];
char ssid_password[65];
byte MAC_ADDRESS[6];

IPAddress ipAddress;
boolean is_accesspoint=false;



// **********************************************
// MQTT SERVER CONFIG
// **********************************************

#define AIO_SERVER      "m12.cloudmqtt.com"
#define AIO_SERVERPORT  17091 //mikhbot@gmail.com                  
//#define AIO_SERVERPORT  13512  //jmehan@yahoo.com                 

#define AIO_USERNAME    "mikbot"
#define AIO_KEY         "mikhailbot"

// **********************************************
// PIN CONFIG
// **********************************************
#define PIN_RIGHT_Forward     14
#define PIN_RIGHT_Backward    12
#define PIN_LEFT_Forward      13
#define PIN_LEFT_Backward     5

#define PIN_STATUS_RED        4
#define PIN_STATUS_GREEN      2
#define PIN_STATUS_BLUE       15


// **********************************************
// LOGGING variables
// **********************************************

char DEBUG_MSG[101];
int  DEBUG_MSG_LEN=100;


// **********************************************
// STATUS LED variables
// **********************************************
int STATUS_STARTING=0;
int STATUS_RUNNING=1;
int STATUS_ACCESS_POINT=2;

int statusColors[][3] = { 
                    {255,0,0},        // STARTING = RED
                    {0,255,0},        // RUNNING = green
                    {0,0,255}         // ACCESS MODE = blue
                    };

int status=STATUS_STARTING;
int led_val=0;
long lastBlink = 0;
int blinkInterval = 1000; // blink every 1 seconds



/************ Global State (you don't need to change this!) ******************/

MDNSResponder mdns;
ESP8266WebServer server(HTTP_LISTEN_PORT);
ESP8266HTTPUpdateServer httpUpdater;

// Create an ESP8266 WiFiClient class to connect to the MQTT server.
WiFiClient client;
// or... use WiFiClientSecure for SSL
//WiFiClientSecure client;

// Store the MQTT server, username, and password in flash memory.
// This is required for using the Adafruit MQTT library.
const char MQTT_SERVER[] PROGMEM    = AIO_SERVER;
const char MQTT_USERNAME[] PROGMEM  = AIO_USERNAME;
const char MQTT_PASSWORD[] PROGMEM  = AIO_KEY;

// Setup the MQTT client class by passing in the WiFi client and MQTT server and login details.
Adafruit_MQTT_Client mqtt(&client, MQTT_SERVER, AIO_SERVERPORT, MQTT_USERNAME, MQTT_PASSWORD);

// **********************************************
// MQTT FEEDS
// **********************************************

// Setup a feed called 'connect' for publishing.
//const char CONNECT_FEED[] PROGMEM = AIO_USERNAME "/connect";
const char CONNECT_FEED[] PROGMEM = "connect";
Adafruit_MQTT_Publish connectFeed = Adafruit_MQTT_Publish(&mqtt, CONNECT_FEED);

// Setup a feed called 'move' for subscribing to changes.
const char MOVE_FEED[] PROGMEM = "move";
Adafruit_MQTT_Subscribe moveFeed = Adafruit_MQTT_Subscribe(&mqtt, MOVE_FEED);







