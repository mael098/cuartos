//#include <Wire.h>
//#include <BH1750.h>
//#include <DHT.h>
#include <WiFi.h>
//#include <PubSubClient.h>
#include <ESPAsyncWebServer.h>

// Pines
const int ST1 = 34;
const int ST2 = 35;
const int ST3 = 32;

// Red WiFi
//const char* SSID = "Conmutación";
//const char* PASSWORD = "3C046109F331.";
const char* SSID = "ツ";
const char* PASSWORD = "12345678";

WiFiClient espClient;

// Web server
AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);

 // pinMode(LED, OUTPUT);
  pinMode(ST1, INPUT);
  pinMode(ST2, INPUT);
  pinMode(ST3, INPUT);

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
    int a1 = analogRead(34);
    int a2 = analogRead(ST2);
    int a3 = analogRead(ST3);

    int c1 = map(a1, 20, 358, -40, 125);
    int c2 = map(a2, 20, 358, -40, 125);
    int c3 = map(a3, 20, 358, -40, 125);

    String json = "["+String(c1)+","+String(c2)+","+String(c3)+"]";

    request->send(200, "application/json", json);
  });

  // prueba de conexion
  // server.on("/led", HTTP_GET, [](AsyncWebServerRequest *request) {
  //   digitalWrite(LED, HIGH);
  //   delay(2000);
  //   digitalWrite(LED, LOW);
  //   request->redirect("/");
  // });

  server.begin();
}

void loop() {
    delay(5000);
    int a1 = analogRead(ST1);
    int a2 = analogRead(ST2);
    int a3 = analogRead(ST3);
    Serial.println("Analog Read: ["+String(a1)+","+String(a2)+","+String(a3)+"]");
    
    int c1 = (a1 * 5.0 * 100.0) / 1024.0;
    int c2 = (a2 * 5.0 * 100.0) / 1024.0;
    int c3 = (a3 * 5.0 * 100.0) / 1024.0;
    Serial.println("Celcius: ["+String(c1)+","+String(c2)+","+String(c3)+"]");
}
