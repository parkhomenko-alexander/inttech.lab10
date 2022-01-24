#include <Wire.h>                               
#include "SparkFunCCS811.h"                     
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "ESP8266WebServer.h"
#include<ArduinoJson.h>

#include "index.h"

const char* ssid = "WLAN";
const char* password = "";
HTTPClient http;  
WiFiClient client;
ESP8266WebServer server(80);
DynamicJsonDocument doc(1024);

#define CCS811_ADDR 0x5A                        
CCS811 mySensor(CCS811_ADDR);                   
 
void setup()
{
  Serial.begin(115200);        
  Wire.begin();                                 
 
  if (mySensor.begin() == false)
  {
    Serial.print("CCS811 error. Please check wiring. Freezing...");
    while (1);
  }
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("Connecting..");
  }
  
  Serial.println(WiFi.localIP());
  server.on("/", handle_index);
  server.on("", handle_index);
  server.on("/det_data", get_data);

  server.begin();
}

void request_data(){
  mySensor.readAlgorithmResults();
  String url = "http://157.230.191.9:8085/request/" + String(mySensor.getCO2()) + "/" + String(mySensor.getTVOC());
  http.begin(client, url);  //Specify request destination
  int httpCode = http.GET(); 
  Serial.println(httpCode);     
}

void handle_index() {
  String s = MAIN_page;
  server.send(200, "text/html", s);
}

void get_data() {
  mySensor.readAlgorithmResults();
  doc["co"]     = String(mySensor.getCO2());
  doc["tvoc"]   = String(mySensor.getTVOC());
  String msg = "";
  serializeJson(doc, msg); 
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  server.send(200, "text/html", msg);
}

void loop()
{
  server.handleClient();
  if (mySensor.dataAvailable())                         
  {
//    request_data();
  }
  delay(400); 
}
