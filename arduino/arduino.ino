#include "DHT.h"
#include "ArduinoJson.h"
#include <AFMotor.h>

#define DHTPIN1 9
#define DHTPIN2 10
#define DHTPIN3 2
#define DHTTYPE DHT11

DHT dht1(DHTPIN1, DHTTYPE);
DHT dht2(DHTPIN2, DHTTYPE);
DHT dht3(DHTPIN3, DHTTYPE);

AF_DCMotor motor1(1); // M1
AF_DCMotor motor2(2); // M2
AF_DCMotor motor3(3); // M3

// manual = false, auto = true
bool mode1 = false;
bool mode2 = false;
bool mode3 = false;

int speed1 = 0;
int speed2 = 0;
int speed3 = 0;

int threshold1_low = 20;
int threshold1_medium = 25;
int threshold1_high = 30;

int threshold2_low = 20;
int threshold2_medium = 25;
int threshold2_high = 30;

int threshold3_low = 20;
int threshold3_medium = 25;
int threshold3_high = 30;

unsigned long last_monitor = 0;

void setup() {
  dht1.begin();
  dht2.begin();
  dht3.begin();

  motor1.run(FORWARD);
  motor2.run(FORWARD);
  motor3.run(FORWARD);
    
  Serial.begin(9600);
  while (!Serial) {
  }
  Serial.println("{\"event\":\"ready\"}");
}

void loop() {
  // --------------
  // EVENTS HANDLER
  // --------------
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
      float t3 = dht3.readTemperature();

      StaticJsonDocument<512> response;
      response["event"] = "get_temp";
      response["id"] = request["id"];
      JsonArray data = response["data"].to<JsonArray>();
      data.add(t1);
      data.add(t2);
      data.add(t3);

      String jsonString;
      serializeJson(response, jsonString);
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
      serializeJson(response, jsonString);
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
      serializeJson(response, jsonString);
      Serial.println(jsonString);
    }
    // --------------
    // GET THRESHOLD
    // --------------
    if (request["event"] == "get_threshold") {
      StaticJsonDocument<512> response;
      response["event"] = "get_threshold";
      response["id"] = request["id"];
      JsonArray data = response["data"].to<JsonArray>();

      JsonArray threshold1 = response["data"].to<JsonArray>();
      threshold1.add(threshold1_low);
      threshold1.add(threshold1_medium);
      threshold1.add(threshold1_high);
      data.add(threshold1);

      JsonArray threshold2 = response["data"].to<JsonArray>();
      threshold2.add(threshold2_low);
      threshold2.add(threshold2_medium);
      threshold2.add(threshold2_high);
      data.add(threshold2);

      JsonArray threshold3 = response["data"].to<JsonArray>();
      threshold3.add(threshold3_low);
      threshold3.add(threshold3_medium);
      threshold3.add(threshold3_high);
      data.add(threshold3);

      String jsonString;
      serializeJson(response, jsonString);
      Serial.println(jsonString);
    }
    // --------------
    // SET MODE
    // --------------
    if (request["event"] == "set_mode") {
      // [mode1, mode2, mode3]
      if (request["data"][0] == "manual") {
        mode1 = false;
      } else {
        mode1 = true;
      }
      if (request["data"][1] == "manual") {
        mode2 = false;
      } else {
        mode2 = true;
      }
      if (request["data"][2] == "manual") {
        mode3 = false;
      } else {
        mode3 = true;
      }
    }
    // --------------
    // SET SPEED
    // --------------
    if (request["event"] == "set_speed") {
      // [speed1, speed2, speed3]
      speed1 = request["data"][0];
      speed2 = request["data"][1];
      speed3 = request["data"][2];
    }
    // --------------
    // SET THRESHOLD
    // --------------
    if (request["event"] == "set_threshold") {
      // [
      //  [threshold1_low, threshold1_medium, threshold1_high],
      //  [threshold2_low, threshold2_medium, threshold2_high],
      //  [threshold3_low, threshold3_medium, threshold3_high]
      // ]

      // threshold 1
      threshold1_low = request["data"][0][0];
      threshold1_medium = request["data"][0][1];
      threshold1_high = request["data"][0][2];

      // threshold 2
      threshold2_low = request["data"][1][0];
      threshold2_medium = request["data"][1][1];
      threshold2_high = request["data"][1][2];

      // threshold 3
      threshold3_low = request["data"][2][0];
      threshold3_medium = request["data"][2][1];
      threshold3_high = request["data"][2][2];
    }
  }
  // --------------
  // THRESHOLD HANDLER
  // --------------
  if (millis() - last_monitor > 5000) {
    last_monitor = millis();
    // --------------
    // THRESHOLD ROOM 1
    // --------------
    if (mode1) {
      // leer el sensor y ajustar la velocidad
      float t1 = dht1.readTemperature();
      if (t1 >= threshold1_high) {
        motor1.setSpeed(255);
      } else if (t1 >= threshold1_medium) {
        motor1.setSpeed(170);
      } else if (t1 >= threshold1_low) {
        motor1.setSpeed(85);
      } else {
        motor1.setSpeed(0);
      }
    } else {
      // poner el ventilador a speed
      int speed = 85 * speed1;
      if (speed <= 255) { 
        motor1.setSpeed(speed);
      }
    }
    // --------------
    // THRESHOLD ROOM 2
    // --------------
    if (mode2) {
      // leer el sensor y ajustar la velocidad
      float t2 = dht2.readTemperature();
      if (t2 >= threshold2_high) {
        motor2.setSpeed(255);
      } else if (t2 >= threshold2_medium) {
        motor2.setSpeed(170);
      } else if (t2 >= threshold2_low) {
        motor2.setSpeed(85);
      } else {
        motor2.setSpeed(0);
      }
    } else {
      // poner el ventilador a speed
      int speed = 85 * speed2;
      if (speed <= 255) { 
        motor2.setSpeed(speed);
      }
    }
    // --------------
    // THRESHOLD ROOM 3
    // --------------
    if (mode3) {
      // leer el sensor y ajustar la velocidad
      float t3 = dht3.readTemperature();
      if (t3 >= threshold3_high) {
        motor3.setSpeed(255);
      } else if (t3 >= threshold3_medium) {
        motor3.setSpeed(170);
      } else if (t3 >= threshold3_low) {
        motor3.setSpeed(85);
      } else {
        motor3.setSpeed(0);
      }
    } else {
      // poner el ventilador a speed
      int speed = 85 * speed3;
      if (speed <= 255) { 
        motor3.setSpeed(speed);
      }
    }
  }  
}