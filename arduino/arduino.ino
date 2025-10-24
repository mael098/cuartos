const int S1 = A0;

void setup() {
    Serial.begin(115200);
    pinMode(S1, INPUT);
}

void loop() {
    int a1 = analogRead(S1);
    Serial.println("ana: "+String(a1));
    float v = map(a1, 20, 358, -40, 125);
    Serial.println(v);
    delay(1000);
}
