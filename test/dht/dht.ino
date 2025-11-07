#include <Wire.h>
#include <DHT.h>

// Pines
#define DHTPIN 34
#define DHTTYPE DHT11
#define LED 2

// Objetos de sensores
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);

  pinMode(LED, OUTPUT);

  // Inicializar sensores
  dht.begin();
}


void loop() {
  float temperatura = dht.readTemperature(); 
  Serial.println(temperatura);

  delay(1000); // cada 10 segundos
}
