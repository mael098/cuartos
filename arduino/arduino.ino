#include "DHT.h"

#define DHTPIN1 2
#define DHTPIN2 3
#define DHTTYPE DHT11

DHT dht1(DHTPIN1,DHTTYPE);
// DHT dht2(DHTPIN2,DHTTYPE);

void setup() {
    dht1.begin();
    // dht2.begin();
    Serial.begin(9600);
    while (!Serial) { }
    Serial.println("{\"event\":\"ready\"}");
}

void loop() {
    if (Serial.available()) {
        String data = Serial.readStringUntil('\n');
        data.trim();
        if (data.startsWith("get_temp")) {
            float t1 = dht1.readTemperature();
            // float t2 = dht2.readTemperature();
            Serial.println(
                String("{")
                + "\"event\":\"get_temp\","
                +"\"id\":\""+getId(data)+"\","
                +"\"data\":["
                    +String(t1)+","
                    +String(t1)+","
                    +String(t1)
                +"]}"
            );
        }
    }
}

String getId(String str) {
    return str.substring(str.indexOf(":") + 1);
}

