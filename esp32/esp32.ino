#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "DHT.h"

// Pines
#define DHTPIN1 21
#define DHTPIN2 22
#define DHTTYPE DHT11

// Red WiFi
//char* SSID = "Conmutación";
//char* PASSWORD = "3C046109F331.";
char* SSID = "Gwynevere";
char* PASSWORD = "3C046109F331amy";

WiFiClient espClient;

// Web server
AsyncWebServer server(80);

DHT dht1(DHTPIN1,DHTTYPE);
DHT dht2(DHTPIN2,DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht1.begin();
  dht2.begin();

  // Conexión WiFi
  WiFi.begin(SSID, PASSWORD);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado.");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Web: mostrar datos
  server.on("/temp", HTTP_GET, [](AsyncWebServerRequest *request) {
    float t1 = dht1.readTemperature();
    float t2 = dht2.readTemperature();

    String json = "["+String(t1)+","+String(t2)+","+String(t2)+"]";

    request->send(200, "application/json", json);
  });
  
  server.begin();
}

void loop() {
  float t1 = dht1.readTemperature();
  float t2 = dht2.readTemperature();
  Serial.println("tem1:"+String(t1));
  Serial.println("tem2:"+String(t2));
  delay (2000);
}
