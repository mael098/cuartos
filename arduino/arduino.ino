#include "DHT.h"
#include "ArduinoJson.h"

#define DHTPIN1 9
#define DHTPIN2 10
#define DHTTYPE DHT11

DHT dht1(DHTPIN1, DHTTYPE);
DHT dht2(DHTPIN2, DHTTYPE);

bool mode1 = false;
bool mode2 = false;
bool mode3 = false;

int speed1 = 0;
int speed2 = 0;
int speed3 = 0;

int threshold1 = 0;
int threshold2 = 0;
int threshold3 = 0;

void setup() {
  dht1.begin();
  dht2.begin();
  Serial.begin(9600);
  while (!Serial) {
  }
  Serial.println("{\"event\":\"ready\"}");
}

void loop() {
  if (Serial.available()) {
    // recibe signal
    String data = Serial.readStringUntil('\n');
    data.trim();
    // process request
    StaticJsonDocument<128> request;
    DeserializationError error = deserializeJson(request, data);
    if (error) return;

    // --------------
    // GET TEMP
    // --------------
    if (request["event"] == "get_temp") {
      
      float t1 = dht1.readTemperature();
      float t2 = dht2.readTemperature();

      StaticJsonDocument<512> response;
      response["event"] = "get_temp";
      response["id"] = request["id"];
      JsonArray data = response["data"].to<JsonArray>();
      data.add(t1);
      data.add(t2);
      data.add(t1);

      String jsonString;
      serializeJson(doc, jsonString);
      Serial.println(jsonString);
    }
    // --------------
    // GET MODE
    // --------------
    if (request["event"] == "get_mode") {
      StaticJsonDocument<512> response;
      response["event"] = "get_mode";
      response["id"] = request["id"];
      JsonArray data = response["data"].to<JsonArray>();
      if (mode1) {
        data.add("auto");
      } else {
        data.add("manual");
      }
      if (mode2) {
        data.add("auto");
      } else {
        data.add("manual");
      }
      if (mode3) {
        data.add("auto");
      } else {
        data.add("manual");
      }

      String jsonString;
      serializeJson(doc, jsonString);
      Serial.println(jsonString);
    }
    // --------------
    // GET SPEED
    // --------------
    if (request["event"] == "get_speed") {
      StaticJsonDocument<512> response;
      response["event"] = "get_speed";
      response["id"] = request["id"];
      JsonArray data = response["data"].to<JsonArray>();
      data.add(speed1);
      data.add(speed2);
      data.add(speed3);

      String jsonString;
      serializeJson(doc, jsonString);
      Serial.println(jsonString);
    }
  }
}